from pathlib import Path
import threading

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.core.config import settings
from app.models.schemas import ScanCreateResponse
from app.services.disputes import build_dispute_draft
from app.services.job_store import job_store
from app.services.parsing import parse_file
from app.services.penalties import estimate_penalty_range
from app.services.scoring import build_penalty_simulator, compute_risk_score
from app.services.updates import get_updates

router = APIRouter(prefix="/scan", tags=["scan"])

def _process_job(job_id: str, saved_path: Path, jurisdiction: str, company_name: str, plan: str) -> None:
    try:
        job_store.update(job_id, status="processing", progress=20, step="Parsing", message="Extracting content")
        parsed_text = parse_file(saved_path)

        job_store.update(job_id, progress=55, step="Risk Scoring", message="Computing risk model")
        risk_score, drivers = compute_risk_score(parsed_text, plan)

        job_store.update(job_id, progress=80, step="Generating Insights", message="Preparing recommendations")
        penalty_estimate = estimate_penalty_range(risk_score)

        result = {
            "job_id": job_id,
            "plan": plan,
            "jurisdiction": jurisdiction,
            "company_name": company_name,
            "risk_score": risk_score,
            "drivers": drivers[:3] if plan == "Basic" else drivers,
            "penalty_estimate": penalty_estimate,
            "updates": get_updates(jurisdiction, count=3),
            "export_enabled": plan == "Enterprise",
        }

        if plan in {"Pro", "Enterprise"}:
            result["benchmark"] = {"industry_avg": 61, "percentile": 74}
            result["confidence"] = 87
            result["penalty_simulator"] = build_penalty_simulator(risk_score)

        if plan == "Enterprise":
            result["dispute_draft"] = build_dispute_draft(company_name, jurisdiction)

        job_store.update(job_id, status="completed", progress=100, step="Completed", message="Analysis ready", result=result)

    except Exception as exc:
        job_store.update(job_id, status="failed", message=str(exc), progress=100)

@router.post("", response_model=ScanCreateResponse)
async def create_scan(
    file: UploadFile = File(...),
    jurisdiction: str = Form("UAE"),
    company_name: str = Form("Acme Corp"),
    plan: str = Form("Basic"),
) -> ScanCreateResponse:

    contents = await file.read()

    max_bytes = settings.max_upload_mb * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(status_code=413, detail="File too large")

    storage_dir = Path(settings.storage_dir)
    storage_dir.mkdir(parents=True, exist_ok=True)

    dest = storage_dir / file.filename
    dest.write_bytes(contents)

    job_id = job_store.create({"filename": file.filename})
    thread = threading.Thread(
        target=_process_job,
        args=(job_id, dest, jurisdiction, company_name, plan),
        daemon=True,
    )
    thread.start()

    return ScanCreateResponse(job_id=job_id)
