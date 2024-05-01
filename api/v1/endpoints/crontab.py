from fastapi import APIRouter, HTTPException, Query
import re

router = APIRouter()

@router.get("/read")
def get_crontab(crontab: str = Query(..., description="Crontab name")):
    try:
        if not crontab:
            raise HTTPException(status_code=400, detail="No se proporcionó el nombre del archivo")

        with open(crontab, 'r') as f:
            crontab_output = f.read()

        crontab_lines = crontab_output.strip().split("\n")
        crontab_data = []
        description = ""
        for line in crontab_lines:
            if line.startswith("#"):
                description = line[2:]
            else:
                match = re.match(r"(\S+ \S+ \S+ \S+ \S+) /home/ansible/scripts/(.+)\.sh", line)
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
        return {"error": f"{crontab} not found."}
    except Exception as e:
        return {"error": str(e)}