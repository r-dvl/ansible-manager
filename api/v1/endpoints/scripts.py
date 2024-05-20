import os
import subprocess
from pathlib import Path
from fastapi import APIRouter, HTTPException


router = APIRouter()

scripts_path = Path(os.getenv('ANSIBLE_SCRIPTS'))

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