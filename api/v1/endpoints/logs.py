from fastapi import APIRouter, Query
from fastapi.responses import FileResponse
from datetime import date
from pathlib import Path
import glob
import re
from collections import Counter

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
        return {"error": "Log doesn't exists."}

@router.get("/total")
def get_log_content(playbook: str = Query(..., description="Playbook name")):
    path = Path(f"/logs/{playbook}/")

    if path.exists():
        # Obtener todas las subcarpetas en la carpeta
        subfolders = [f.name for f in path.iterdir() if f.is_dir()]

        # Extraer el año y el mes de cada nombre de subcarpeta
        dates = [re.search(r"\d{4}-\d{2}", folder).group(0) for folder in subfolders]

        # Contar las ocurrencias de cada fecha
        date_counts = dict(Counter(dates))

        return date_counts
    else:
        return {"error": "Path doesn't exists."}