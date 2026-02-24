import json

from fastapi import APIRouter, HTTPException, Response

from app.services.job_store import job_store

router = APIRouter(prefix="/export", tags=["export"])


@router.get("/{job_id}")
def export_result(job_id: str) -> Response:
    job = job_store.get(job_id)
    if not job or job["status"] != "completed":
        raise HTTPException(status_code=404, detail="Result not ready")
    result = job.get("result") or {}
    if not result.get("export_enabled"):
        raise HTTPException(status_code=403, detail="Enterprise plan required")
    content = json.dumps(result, default=str)
    return Response(
        content=content,
        media_type="application/json",
        headers={"Content-Disposition": f"attachment; filename=regintel-{job_id}.json"},
    )
