from fastapi import APIRouter
from fastapi.responses import PlainTextResponse
import subprocess

router = APIRouter()

@router.get("/get-crontab", response_class=PlainTextResponse)
def get_crontab():
    command = "crontab -l"
    result = subprocess.check_output(command, shell=True)
    return result.decode("utf-8")