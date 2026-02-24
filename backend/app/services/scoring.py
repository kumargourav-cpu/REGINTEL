from .penalties import estimate_penalty_range


def compute_risk_score(parsed_text: str, plan: str) -> tuple[int, list[dict]]:
    base = min(92, 45 + (len(parsed_text) % 50))
    plan_boost = {"Basic": 0, "Pro": -3, "Enterprise": -5}.get(plan, 0)
    score = max(5, min(99, base + plan_boost))
    drivers = [
        {"name": "Documentation gaps", "impact": 27, "detail": "Missing policy attachments."},
        {"name": "Late filing pattern", "impact": 23, "detail": "2 prior delayed submissions."},
        {"name": "Control weakness", "impact": 18, "detail": "Approval chain not fully enforced."},
        {"name": "Vendor mismatch", "impact": 12, "detail": "Invoice metadata inconsistencies."},
        {"name": "Reporting variance", "impact": 9, "detail": "Quarterly trend drift."},
    ]
    return score, drivers


def build_penalty_simulator(score: int) -> dict:
    penalty = estimate_penalty_range(score, "AED")
    return {
        "base_risk_score": score,
        "assumptions": ["First-time finding", "No fraud evidence"],
        "projected_penalty": penalty,
    }
