from fastapi import APIRouter, HTTPException
import yaml
import os
import glob
import re
import subprocess

router = APIRouter()

# Playbooks path
base_path = "/ansible-playbooks/playbooks/"
scripts_path = "/ansible-playbooks/scripts/"
crontab_path = '/etc/cron.d/ansible'

@router.get("/get-playbooks")
def get_playbooks():
    """
    This endpoint reads all .yaml files in the specified path and checks if it is scheduled in crontab.
    Each playbook is added to the 'playbooks' list.
    """
    # Check if path exists
    if not os.path.exists(base_path):
        return {"error": "The specified path does not exist."}

    # Fetch every playbook
    yaml_files = glob.glob(os.path.join(base_path, '*.yaml'))

    playbooks = {}

    # Read every playbook
    for yaml_file in yaml_files:
        with open(yaml_file, 'r') as stream:
            try:
                data = yaml.safe_load(stream)
                playbook_file_name = os.path.splitext(os.path.basename(yaml_file))[0]
                with open(crontab_path, 'r') as f:
                    crontab_output = f.read()

                crontab_lines = crontab_output.strip().split("\n")
                description = ""
                scheduled = False

                for line in crontab_lines:
                    if line.startswith("#"):
                        description = line[2:]
                    else:
                        match = re.match(r"(\S+ \S+ \S+ \S+ \S+) /ansible-playbooks/scripts/(.+)\.sh", line)
                        if match:
                            cron_expression, task_name = match.groups()
                            if playbook_file_name in task_name:
                                # Add the 'hosts' and 'schedule' fields to the dictionary
                                playbooks[task_name] = {
                                    'hosts': data[0]['hosts'],
                                    "description": description,
                                    "cron_expression": cron_expression,
                                    "task_name": task_name
                                }
                            description = ""
                            scheduled = True

                    if not scheduled:
                        playbooks[playbook_file_name] = {
                            'hosts': data[0]['hosts'],
                            "description": "-",
                            "cron_expression": "-",
                            "task_name": playbook_file_name
                        }

            except yaml.YAMLError as exc:
                return {"error": f"Error reading {yaml_file}."}

    return playbooks

@router.post("/execute-script/{script_name}")
def execute_script(script_name: str):
    """
    This endpoint executes a script located in /ansible-playbooks/scripts/.
    The script name is passed as a path parameter.
    """
    script_path = os.path.join(scripts_path, script_name)

    # Check if script exists
    if not os.path.exists(script_path):
        raise HTTPException(status_code=404, detail="Script not found")

    # Execute the script
    result = subprocess.run(["bash", script_path], capture_output=True, text=True)

    # Return the result
    return {"output": result.stdout, "error": result.stderr}