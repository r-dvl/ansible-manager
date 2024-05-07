from fastapi import APIRouter, Query, HTTPException
import subprocess
import os

router = APIRouter()

# Scripts path
scripts_path = '/ansible-playbooks/scripts/'

@router.get("/execute")
async def execute_script(script: str = Query(..., description="Script name")):
    """
    Endpoint to execute a given script.

    Args:
        script (str): The name of the script to execute.

    Returns:
        dict: A dictionary with the script output or an error message.
    """
    script_path = os.path.join(scripts_path, script)

    # Check if the script exists
    if not os.path.exists(script_path):
        raise HTTPException(status_code=404, detail="Script not found")

    # Execute the script
    process = subprocess.Popen(script_path, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()

    if process.returncode != 0:
        # If the script returns an error, return the error message
        return {"error": stderr.decode()}

    # If the script executes successfully, return the output
    return {"output": stdout.decode()}
