from pydantic import BaseModel


class BulletRewrite(BaseModel):
    original: str
    suggested: str | None
    error: str | None = None


class SuggestionsResponse(BaseModel):
    ai_available: bool
    message: str | None
    bullet_rewrites: list[BulletRewrite]
    score_explanation: str | None