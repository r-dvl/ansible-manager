import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from v1.endpoints import foo


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(foo.router, prefix="/v1/foo", tags=["foo"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)