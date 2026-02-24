def estimate_penalty_range(risk_score: int, currency: str = "AED") -> dict:
    minimum = max(1000, risk_score * 120)
    maximum = minimum * 2.4
    return {"minimum": round(minimum, 2), "maximum": round(maximum, 2), "currency": currency}
