def build_dispute_draft(company_name: str, jurisdiction: str) -> str:
    return (
        f"Subject: Objection to preliminary compliance assessment for {company_name}\n\n"
        f"To whom it may concern,\n"
        f"We respectfully submit this objection within the applicable {jurisdiction} process window. "
        "Our records show substantial controls in place, and we request a reassessment with attached evidence.\n\n"
        "Sincerely,\nCompliance Office"
    )
