import subprocess
import re
from fastapi import APIRouter
from fastapi.responses import JSONResponse

router = APIRouter()

@router.get("/read", response_class=JSONResponse)
def get_crontab():
    try:
        crontab_output = subprocess.check_output(["crontab", "-l"], stderr=subprocess.STDOUT, text=True)

        crontab_lines = crontab_output.strip().split("\n")
        crontab_data = []
        for line in crontab_lines:
            match = re.match(r"# (.+)\n(\S+ \S+ \S+ \S+ \S+) (.+\.sh)", line)
            if match:
                description, cron_expression, task_name = match.groups()
                crontab_data.append({
                    "description": description,
                    "datetime": cron_expression,
                    "task_name": task_name
                })

        return {"crontab": crontab_data}
    except subprocess.CalledProcessError as e:
        return {"error": f"Error obtaining Crontab"}