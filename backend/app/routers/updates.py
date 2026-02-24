from fastapi import APIRouter, Query

from app.services.updates import get_updates

router = APIRouter(prefix="/updates", tags=["updates"])


@router.get("")
def updates(jurisdiction: str = Query("UAE"), industry: str | None = Query(None)) -> dict:
    return {"items": get_updates(jurisdiction=jurisdiction, industry=industry, count=3)}
