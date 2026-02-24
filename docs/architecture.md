# RegIntel Architecture

RegIntel uses a hybrid compliance engine:
- FastAPI backend handles ingestion, parsing, deterministic scoring, and plan-aware outputs.
- React frontend provides a dark-glass analyst dashboard with progressive scan states.
- In-memory job orchestration supports polling and asynchronous progress.

Pipeline: Upload -> Parse -> Risk Score -> Insight Generation -> Rendered cards/gauges.
