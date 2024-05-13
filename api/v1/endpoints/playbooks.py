from fastapi import APIRouter
import yaml
import os
import glob

router = APIRouter()

# Playbooks path
base_path = "/ansible-playbooks/playbooks/"

@router.get("/get-playbooks")
def get_playbooks():
    """
    This endpoint reads all .yaml files in the specified path, ignoring directories.
    Each playbook is added to the 'playbooks_info' dictionary with its name as the key.
    """
    # Check if path exists
    if not os.path.exists(base_path):
        return {"error": "The specified path does not exist."}

    # Find every playbook
    yaml_files = glob.glob(os.path.join(base_path, '*.yaml'))

    playbooks_info = {}

    # Read every playbook
    for yaml_file in yaml_files:
        with open(yaml_file, 'r') as stream:
            try:
                data = yaml.safe_load(stream)
                playbook_name = os.path.basename(yaml_file).replace('.yaml', '')
                playbooks_info[playbook_name] = data
            except yaml.YAMLError as exc:
                return {"error": f"Error reading {yaml_file}."}

    return playbooks_info