from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

# ✅ Import routers directly (robust on Render)
from app.routers.health import router as health_router
from app.routers.scan import router as scan_router
from app.routers.jobs import router as jobs_router
from app.routers.results import router as results_router
from app.routers.penalties import router as penalties_router
from app.routers.updates import router as updates_router
from app.routers.export import router as export_router

app = FastAPI(title=settings.app_name)

origins = [item.strip() for item in settings.cors_origins.split(",") if item.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix=settings.api_prefix)
app.include_router(scan_router, prefix=settings.api_prefix)
app.include_router(jobs_router, prefix=settings.api_prefix)
app.include_router(results_router, prefix=settings.api_prefix)
app.include_router(penalties_router, prefix=settings.api_prefix)
app.include_router(updates_router, prefix=settings.api_prefix)
app.include_router(export_router, prefix=settings.api_prefix)
