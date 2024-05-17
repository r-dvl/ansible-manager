import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from v1.endpoints import crontab, logs, hosts, playbooks


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(crontab.router, prefix="/v1/crontab", tags=["crontab"])
app.include_router(logs.router, prefix="/v1/logs", tags=["logs"])
app.include_router(hosts.router, prefix="/v1/hosts", tags=["hosts"])
app.include_router(playbooks.router, prefix="/v1/playbooks", tags=["playbooks"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)