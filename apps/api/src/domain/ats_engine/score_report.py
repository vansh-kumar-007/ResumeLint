from pydantic import BaseModel


class BulletAnalysis(BaseModel):
    text: str
    score: int
    word_count: int
    has_action_verb: bool
    has_metric: bool
    issues: list[str]


class ScoreReport(BaseModel):
    overall_score: float
    cap_reasons: list[str]
    section_scores: dict
    bullet_analyses: list[BulletAnalysis]