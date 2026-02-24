from io import BytesIO
import csv
from pathlib import Path

from pypdf import PdfReader


def parse_file(path: Path) -> str:
    suffix = path.suffix.lower()
    if suffix == ".pdf":
        return _parse_pdf(path)
    if suffix == ".csv":
        return _parse_csv(path)
    if suffix in {".png", ".jpg", ".jpeg"}:
        return "OCR stub: detected image content."
    return "Unsupported file type summary."


def _parse_pdf(path: Path) -> str:
    reader = PdfReader(str(path))
    snippets = []
    for page in reader.pages[:3]:
        snippets.append((page.extract_text() or "")[:500])
    return "\n".join(snippets).strip() or "No text extracted from PDF"


def _parse_csv(path: Path) -> str:
    text = path.read_text(encoding="utf-8", errors="ignore")
    rows = list(csv.reader(BytesIO(text.encode("utf-8")).read().decode("utf-8").splitlines()))
    return f"CSV rows: {len(rows)}; columns: {len(rows[0]) if rows else 0}"
