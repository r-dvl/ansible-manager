from fastapi import APIRouter
from fastapi.responses import JSONResponse
import subprocess

router = APIRouter()

@router.get("/get-playbooks", response_class=JSONResponse)
def get_playbooks():
    try:
        result = subprocess.check_output(f"ls -1 /logs", shell=True)
        playbooks = result.decode("utf-8").splitlines()
        return {"playbooks": playbooks}
    except subprocess.CalledProcessError:
        return {"error": "There are not playbooks executed."}