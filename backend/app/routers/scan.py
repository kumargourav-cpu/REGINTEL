from pathlib import Path
import threading

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile

from app.core.auth import require_auth
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
        update_count = 2 if plan == "Basic" else 3

        result = {
            "job_id": job_id,
            "plan": plan,
            "jurisdiction": jurisdiction,
            "company_name": company_name,
            "risk_score": risk_score,
            "drivers": drivers[:3] if plan == "Basic" else drivers[:5],
            "penalty_estimate": penalty_estimate,
            "updates": get_updates(jurisdiction, count=update_count),
            "benchmark": None,
            "confidence": None,
            "recommendations": None,
            "penalty_simulator": None,
            "dispute_draft": None,
            "action_plan": None,
            "export_enabled": False,
        }

        if plan in {"Pro", "Enterprise"}:
            result["benchmark"] = {"industry_avg": 61, "percentile": 74}
            result["confidence"] = 87
            result["recommendations"] = [
                {"title": "Close policy evidence gaps", "owner": "Legal", "due_in_days": 10},
                {"title": "Automate filing reminders", "owner": "Finance", "due_in_days": 21},
            ]
            result["penalty_simulator"] = build_penalty_simulator(risk_score)

        if plan == "Enterprise":
            result["dispute_draft"] = build_dispute_draft(company_name, jurisdiction)
            result["action_plan"] = {
                "phase_1": ["Collect evidence", "Validate controls"],
                "phase_2": ["Run remediation sprint", "Executive review"],
            }
            result["export_enabled"] = True

        job_store.update(job_id, status="completed", progress=100, step="Completed", message="Analysis ready", result=result)
    except Exception as exc:
        job_store.update(job_id, status="failed", step="Failed", message=str(exc), progress=100)


@router.post("", response_model=ScanCreateResponse)
async def create_scan(
    _user=Depends(require_auth),
    file: UploadFile = File(...),
    jurisdiction: str = Form("UAE"),
    company_name: str = Form("Acme Corp"),
    plan: str = Form("Basic"),
) -> ScanCreateResponse:
    if plan not in {"Basic", "Pro", "Enterprise"}:
        raise HTTPException(status_code=400, detail="Invalid plan")

    contents = await file.read()
    max_bytes = settings.max_upload_mb * 1024 * 1024
    if len(contents) > max_bytes:
        raise HTTPException(status_code=413, detail=f"File too large. Max {settings.max_upload_mb} MB")

    storage_dir = Path(settings.storage_dir)
    storage_dir.mkdir(parents=True, exist_ok=True)
    safe_name = file.filename or "upload.bin"
    dest = storage_dir / safe_name
    dest.write_bytes(contents)

    job_id = job_store.create({"filename": safe_name, "plan": plan})
    job_store.update(job_id, status="processing", progress=10, step="Uploading", message="Upload complete")

    thread = threading.Thread(target=_process_job, args=(job_id, dest, jurisdiction, company_name, plan), daemon=True)
    thread.start()
    return ScanCreateResponse(job_id=job_id)
