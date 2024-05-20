import os
import yaml
import glob
import re
from pathlib import Path
from fastapi import APIRouter


router = APIRouter()

playbooks_path = Path(os.getenv('ANSIBLE_PLAYBOOKS'))
crontab_path = Path('/etc/cron.d/ansible')

@router.get("/")
def get_playbooks():
    """
    This endpoint reads all .yaml files in the specified path and checks if it is scheduled in crontab.
    Each playbook is added to the 'playbooks' list.
    """
    # Check if path exists
    if not os.path.exists(playbooks_path):
        return {"error": "The specified path does not exist."}

    # Fetch every playbook
    yaml_files = glob.glob(os.path.join(playbooks_path, '*.yaml'))

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