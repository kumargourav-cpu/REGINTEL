from fastapi import APIRouter

from app.models.schemas import PenaltySimulationRequest, PenaltySimulationResponse
from app.services.penalties import estimate_penalty_range

router = APIRouter(prefix="/penalty", tags=["penalties"])


@router.post("/simulate", response_model=PenaltySimulationResponse)
def simulate_penalty(payload: PenaltySimulationRequest) -> PenaltySimulationResponse:
    risk = int(payload.scenario.get("risk_score", 50))
    estimate = estimate_penalty_range(risk)
    return PenaltySimulationResponse(
        plan=payload.plan,
        scenario=payload.scenario,
        estimated_range=estimate,
        notes=["Illustrative estimate", "Not legal advice"],
    )
