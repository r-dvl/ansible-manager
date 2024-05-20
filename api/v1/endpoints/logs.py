import os
from datetime import date, datetime
from pathlib import Path
from fastapi import APIRouter, Query
from fastapi.responses import FileResponse


router = APIRouter()

# Logs Path
logs_path = Path(os.getenv('ANSIBLE_LOGS'))

@router.get("/get-log-content")
def get_log_content(
    date: date = Query(..., description="Date (YYYY-MM-DD)"),
    time: str = Query(..., description="Time (hh-mm-ss)"),
    playbook: str = Query(..., description="Playbook name")
):
    '''
    Fetches the content of a log file.

    Parameters:
    date (date): The date when the log was created.
    time (str): The time when the log was created.
    playbook (str): The name of the playbook.

    Returns:
    FileResponse: The content of the log file as a text file.
    dict: An error message if the log file does not exist.
    '''
    log_file_path = Path(f"/logs/{playbook}/{date}/{time}.log")

    if log_file_path.exists():
        return FileResponse(log_file_path, media_type="text/plain")
    else:
        return {"error": "Log doesn't exists."}

@router.get("/execution-statistics")
def execution_statistics(
    year: str = Query(..., description="Year to fetch"),
):
    '''
    Fetches execution statistics for a given year.

    Parameters:
    year (str): The year to fetch statistics for.

    Returns:
    dict: A dictionary containing execution statistics for each playbook and globally.
    dict: An error message if the logs directory does not exist.
    '''
    if logs_path.exists():
        # Obtain folders inside /logs/ (Every playbook logs)
        playbooks = [f for f in logs_path.iterdir() if f.is_dir()]

        results = {}

        # Global statistics counters
        global_total_counts = {f"{year}-{month:02}": 0 for month in range(1, 13)}
        global_success_counts = {f"{year}-{month:02}": 0 for month in range(1, 13)}
        global_failed_counts = {f"{year}-{month:02}": 0 for month in range(1, 13)}

        for playbook in playbooks:
            # Obtain every subfolder inside playook logs (Dates)
            subfolders = [f for f in playbook.iterdir() if f.is_dir()]

            # Playbook statistics counters
            total_counts = {f"{year}-{month:02}": 0 for month in range(1, 13)}
            success_counts = {f"{year}-{month:02}": 0 for month in range(1, 13)}
            failed_counts = {f"{year}-{month:02}": 0 for month in range(1, 13)}

            for folder in subfolders:
                if folder.name.startswith(year):
                    for log_file in folder.glob('*.log'):
                        # Increase total statistics
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

            # Playbook statistics
            total_executions_per_month = [total_counts.get(f"{year}-{month:02}", 0) for month in range(1, 13)]
            success_executions_per_month = [success_counts.get(f"{year}-{month:02}", 0) for month in range(1, 13)]
            failed_executions_per_month = [failed_counts.get(f"{year}-{month:02}", 0) for month in range(1, 13)]

            # Add Playbook
            results[playbook.name] = {
                "total": total_executions_per_month,
                "success": success_executions_per_month,
                "failed": failed_executions_per_month
            }

        # Global statistics
        global_total_executions_per_month = [global_total_counts.get(f"{year}-{month:02}", 0) for month in range(1, 13)]
        global_success_executions_per_month = [global_success_counts.get(f"{year}-{month:02}", 0) for month in range(1, 13)]
        global_failed_executions_per_month = [global_failed_counts.get(f"{year}-{month:02}", 0) for month in range(1, 13)]

        # Add global results to list
        results["global"] = {
            "total": global_total_executions_per_month,
            "success": global_success_executions_per_month,
            "failed": global_failed_executions_per_month
        }

        return results
    else:
        return {"error": "Path doesn't exists."}

 # TODO: Number of executions to fetch as endpoint parameter
@router.get("/last-executions")
def last_executions():
    '''
    Fetches the last five executions.

    Returns:
    list: A list of dictionaries, each containing information about an execution.
    dict: An error message if the logs directory does not exist.
    '''
    if logs_path.exists():
        # Obtain folders inside /logs/ (Every playbook logs)
        playbooks = [f for f in logs_path.iterdir() if f.is_dir()]

        executions = []

        for playbook in playbooks:
            # Obtain every subfolder inside playook logs (Dates)
            subfolders = [f for f in playbook.iterdir() if f.is_dir()]

            for folder in subfolders:
                for log_file in folder.glob('*.log'):
                    with open(log_file, 'r') as file:
                        log_content = file.read()
                        if 'failed=0' in log_content:
                            status = 'success'
                        else:
                            status = 'failed'
                        # Get date and time from folder and log file
                        date_str = folder.name
                        time_str = log_file.stem
                        # Parse time
                        datetime_obj = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H-%M-%S")
                        # JavaScript expected format
                        datetime_str = datetime_obj.strftime("%Y-%m-%dT%H:%M:%S.%fZ")
                        # Add execution to list
                        executions.append({
                            "playbook": playbook.name,
                            "status": status,
                            "datetime": datetime_str,
                        })

        # Order by date and time and return last 5 executions
        executions.sort(key=lambda x: x["datetime"], reverse=True)
        last_executions = executions[:5]

        return last_executions
    else:
        return {"error": "Path doesn't exists."}