from fastapi import APIRouter, HTTPException, Query
import re


router = APIRouter()

crontab_path = '/etc/cron.d/ansible'

@router.get("/")
def get_crontab():
    '''
    Reads a crontab file with a specific format and returns a list of tasks.

    Format:
    # Description
    * * * * * /path/to/script.sh

    The function reads the specified crontab file, parses it, and returns a list of tasks.
    Each task is represented as a dictionary with the following keys:
    - description: A string that describes the task.
    - cron_expression: A string that represents the cron expression for the task.
    - task_name: The name of the task.

    Returns:
    dict: A dictionary with a single key "crontab" that maps to a list of tasks.
    Each task is a dictionary with keys "description", "cron_expression", and "task_name".
    If an error occurs, the dictionary contains a single key "error" with a string description of the error.
    '''
    try:
        with open(crontab_path, 'r') as f:
            crontab_output = f.read()

        crontab_lines = crontab_output.strip().split("\n")
        crontab_data = []
        description = ""
        for line in crontab_lines:
            if line.startswith("#"):
                description = line[2:]
            else:
                match = re.match(r"(\S+ \S+ \S+ \S+ \S+) /ansible-playbooks/scripts/(.+)\.sh", line)
                if match:
                    cron_expression, task_name = match.groups()
                    crontab_data.append({
                        "description": description,
                        "cron_expression": cron_expression,
                        "task_name": task_name
                    })
                    description = ""

        return {"crontab": crontab_data}
    except FileNotFoundError:
        return {"error": "Crontab not found."}
    except Exception as e:
        return {"error": str(e)}

@router.get("/get-task")
def get_task(task: str = Query(..., description="Task to fetch")):
    try:
        with open(crontab_path, 'r') as f:
            crontab_output = f.read()

        crontab_lines = crontab_output.strip().split("\n")
        task_data = []
        description = ""
        for line in crontab_lines:
            if line.startswith("#"):
                description = line[2:]
            else:
                match = re.match(r"(\S+ \S+ \S+ \S+ \S+) /ansible-playbooks/scripts/(.+)\.sh", line)
                if match:
                    cron_expression, task_name = match.groups()
                    if task in task_name:
                        task_data.append({
                            "description": description,
                            "cron_expression": cron_expression,
                            "task_name": task_name
                        })
                    description = ""

        return {"task": task_data}
    except FileNotFoundError:
        return {"error": "Crontab not found."}
    except Exception as e:
        return {"error": str(e)}