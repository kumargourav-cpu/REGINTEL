from fastapi import APIRouter, HTTPException

from app.services.job_store import job_store

router = APIRouter(prefix="/results", tags=["results"])


@router.get("/{job_id}")
def get_results(job_id: str) -> dict:
    job = job_store.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job["status"] != "completed":
        raise HTTPException(status_code=409, detail="Job not completed")
    return job["result"]
