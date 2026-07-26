from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.api.routers import resumes

app = FastAPI(
    title="ResumeLint API",
    description="Engineering-grade resume analysis API",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resumes.router)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}