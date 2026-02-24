from datetime import datetime
from typing import Any, Literal

from pydantic import BaseModel, Field

PlanType = Literal["Basic", "Pro", "Enterprise"]
JobStatus = Literal["pending", "processing", "completed", "failed"]

class ScanCreateResponse(BaseModel):
    job_id: str

class JobStatusResponse(BaseModel):
    status: JobStatus
    progress: int = Field(ge=0, le=100)
    step: str
    message: str

class PenaltyRange(BaseModel):
    minimum: float
    maximum: float
    currency: str = "AED"

class Driver(BaseModel):
    name: str
    impact: int
    detail: str

class Benchmark(BaseModel):
    industry_avg: int
    percentile: int

class Recommendation(BaseModel):
    title: str
    owner: str
    due_in_days: int

class UpdateItem(BaseModel):
    headline: str
    date: datetime

class ResultPayload(BaseModel):
    job_id: str
    plan: PlanType
    jurisdiction: str
    company_name: str
    risk_score: int
    drivers: list[Driver]
    penalty_estimate: PenaltyRange
    updates: list[UpdateItem]
    benchmark: Benchmark | None = None
    confidence: int | None = None
    recommendations: list[Recommendation] | None = None
    penalty_simulator: dict[str, Any] | None = None
    dispute_draft: str | None = None
    action_plan: dict[str, Any] | None = None
    export_enabled: bool = False
