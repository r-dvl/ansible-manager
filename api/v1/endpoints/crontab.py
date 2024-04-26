from fastapi import FastAPI
import subprocess

router = FastAPI()

@router.get("/read-crontab")
def read_crontab():
    command = "crontab -l"  # Comando personalizado
    result = subprocess.check_output(command, shell=True)
    return {"output": result.decode("utf-8")}