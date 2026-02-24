import threading
from datetime import datetime
from typing import Any
from uuid import uuid4

class JobStore:
    def __init__(self) -> None:
        self._jobs: dict[str, dict[str, Any]] = {}
        self._lock = threading.Lock()

    def create(self, metadata: dict[str, Any]) -> str:
        job_id = str(uuid4())
        with self._lock:
            self._jobs[job_id] = {
                "status": "pending",
                "progress": 0,
                "step": "Uploading",
                "message": "Upload queued",
                "created_at": datetime.utcnow().isoformat(),
                "metadata": metadata,
                "result": None,
            }
        return job_id

    def update(self, job_id: str, **updates: Any) -> None:
        with self._lock:
            if job_id in self._jobs:
                self._jobs[job_id].update(updates)

    def get(self, job_id: str):
        return self._jobs.get(job_id)

job_store = JobStore()
