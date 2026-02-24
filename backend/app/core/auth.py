from fastapi import Header, HTTPException
from jose import jwt

from app.core.config import settings


def require_auth(authorization: str | None = Header(None)) -> dict:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.split(" ", 1)[1].strip()

    if not settings.supabase_jwt_secret:
        raise HTTPException(status_code=500, detail="Server misconfigured: SUPABASE_JWT_SECRET missing")

    try:
        payload = jwt.decode(
            token,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            options={"verify_aud": False},
        )
        return payload
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
