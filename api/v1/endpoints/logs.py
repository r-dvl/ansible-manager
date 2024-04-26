from fastapi import APIRouter, Query
from fastapi.responses import FileResponse
from datetime import date
from pathlib import Path

router = APIRouter()

@router.get("/get-log-content")
def get_log_content(
    date: date = Query(..., description="Date (YYYY-MM-DD)"),
    time: str = Query(..., description="Time (hh-mm-ss)"),
    playbook: str = Query(..., description="Playbook name")
):
    log_file_path = Path(f"/logs/{playbook}/{date}/{time}.log")

    if log_file_path.exists():
        return FileResponse(log_file_path, media_type="text/plain")
    else:
        return {"error": "Log doesn't exists"}