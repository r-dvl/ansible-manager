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

@router.get("/execution-statistics")
def execution_statistics(
    year: str = Query(..., description="Year to fetch"),
):
    path = Path("/logs/")

    if path.exists():
        # Obtener todas las carpetas de playbook en la carpeta
        playbooks = [f for f in path.iterdir() if f.is_dir()]

        results = {}

        # Crear contadores para el total global
        global_total_counts = {f"{year}-{month:02}": 0 for month in range(1, 13)}
        global_success_counts = {f"{year}-{month:02}": 0 for month in range(1, 13)}
        global_failed_counts = {f"{year}-{month:02}": 0 for month in range(1, 13)}

        for playbook in playbooks:
            # Obtener todas las subcarpetas en la carpeta del playbook
            subfolders = [f for f in playbook.iterdir() if f.is_dir()]

            # Crear contadores para total, exitosas y fallidas
            total_counts = {f"{year}-{month:02}": 0 for month in range(1, 13)}
            success_counts = {f"{year}-{month:02}": 0 for month in range(1, 13)}
            failed_counts = {f"{year}-{month:02}": 0 for month in range(1, 13)}

            for folder in subfolders:
                if folder.name.startswith(year):
                    for log_file in folder.glob('*.log'):
                        # Incrementar el total de ejecuciones para este mes
                        total_counts[folder.name[:7]] += 1
                        global_total_counts[folder.name[:7]] += 1

                        with open(log_file, 'r') as file:
                            log_content = file.read()
                            if 'failed=0' in log_content:
                                status = 'success'
                                success_counts[folder.name[:7]] += 1
                                global_success_counts[folder.name[:7]] += 1
                            else:
                                status = 'failed'
                                failed_counts[folder.name[:7]] += 1
                                global_failed_counts[folder.name[:7]] += 1

            # Crear arrays para total, ejecuciones exitosas y fallidas
            total_executions_per_month = [total_counts.get(f"{year}-{month:02}", 0) for month in range(1, 13)]
            success_executions_per_month = [success_counts.get(f"{year}-{month:02}", 0) for month in range(1, 13)]
            failed_executions_per_month = [failed_counts.get(f"{year}-{month:02}", 0) for month in range(1, 13)]

            # Agregar los resultados para este playbook al resultado final
            results[playbook.name] = {
                "total": total_executions_per_month,
                "success": success_executions_per_month,
                "failed": failed_executions_per_month
            }

        # Crear arrays para el total global
        global_total_executions_per_month = [global_total_counts.get(f"{year}-{month:02}", 0) for month in range(1, 13)]
        global_success_executions_per_month = [global_success_counts.get(f"{year}-{month:02}", 0) for month in range(1, 13)]
        global_failed_executions_per_month = [global_failed_counts.get(f"{year}-{month:02}", 0) for month in range(1, 13)]

        # Agregar los resultados globales al resultado final
        results["global"] = {
            "total": global_total_executions_per_month,
            "success": global_success_executions_per_month,
            "failed": global_failed_executions_per_month
        }

        return results
    else:
        return {"error": "Path doesn't exists."}