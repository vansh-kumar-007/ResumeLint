from fastapi import FastAPI

app = FastAPI(
    title="ResumeLint API",
    description="Engineering-grade resume analysis API",
    version="0.1.0",
)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}