from fastapi import APIRouter, Depends, Query

from app.core.auth import require_auth
from app.services.updates import get_updates

router = APIRouter(prefix="/updates", tags=["updates"])


@router.get("")
def updates(_user=Depends(require_auth), jurisdiction: str = Query("UAE"), industry: str | None = Query(None)) -> dict:
    return {"items": get_updates(jurisdiction=jurisdiction, industry=industry, count=3)}
