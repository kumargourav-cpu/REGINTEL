from datetime import datetime, timedelta


def get_updates(jurisdiction: str = "UAE", industry: str | None = None, count: int = 3) -> list[dict]:
    base = [
        f"{jurisdiction} regulator updates filing control guidance",
        f"{jurisdiction} introduces revised compliance checklist",
        f"{jurisdiction} enforcement memo highlights remediation timelines",
    ]
    if industry:
        base = [f"{industry}: {item}" for item in base]
    now = datetime.utcnow()
    return [{"headline": base[i % len(base)], "date": now - timedelta(days=i * 3)} for i in range(count)]
