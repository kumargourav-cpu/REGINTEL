from fastapi import APIRouter, Depends, HTTPException

from app.core.auth import require_auth
from app.models.schemas import JobStatusResponse
from app.services.job_store import job_store

router = APIRouter(prefix="/jobs", tags=["jobs"])


@router.get("/{job_id}", response_model=JobStatusResponse)
def get_job(job_id: str, _user=Depends(require_auth)) -> JobStatusResponse:
    job = job_store.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return JobStatusResponse(
        status=job["status"],
        progress=job["progress"],
        step=job["step"],
        message=job["message"],
    )
