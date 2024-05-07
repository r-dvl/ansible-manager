from fastapi import APIRouter, HTTPException, Query
import re


router = APIRouter()

# Crontabs path
path = '/crontabs'

@router.get("/read")
def get_crontab(crontab: str = Query(..., description="Crontab name")):
    '''
    Reads a crontab file with a specific format and returns a list of tasks.

    Format:
    # Description
    * * * * * /path/to/scripts/script.sh

    The function reads the specified crontab file, parses it, and returns a list of tasks.
    Each task is represented as a dictionary with the following keys:
    - description: A string that describes the task.
    - cron_expression: A string that represents the cron expression for the task.
    - task_name: The name of the task.

    Parameters:
    crontab (str): The name of the crontab file to read.

    Returns:
    dict: A dictionary with a single key "crontab" that maps to a list of tasks.
    Each task is a dictionary with keys "description", "cron_expression", and "task_name".
    If an error occurs, the dictionary contains a single key "error" with a string description of the error.
    '''
    try:
        if not crontab:
            raise HTTPException(status_code=400, detail="File name not specified")

        with open(f"{path}/{crontab}", 'r') as f:
            crontab_output = f.read()

        crontab_lines = crontab_output.strip().split("\n")
        crontab_data = []
        description = ""
        for line in crontab_lines:
            if line.startswith("#"):
                description = line[2:]
            else:
                match = re.match(r"(\S+ \S+ \S+ \S+ \S+) /home/ansible/ansible-playbooks/scripts/(.+)\.sh", line)
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
        return {"error": f"{crontab} crontab not found."}
    except Exception as e:
        return {"error": str(e)}