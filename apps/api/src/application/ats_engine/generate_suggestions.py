from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.infrastructure.ai_providers import AIProviderError, NoAIProviderConfiguredError, build_ai_router
from src.infrastructure.ai_providers.prompts import (
    BULLET_REWRITE_SYSTEM_PROMPT,
    SCORE_EXPLANATION_SYSTEM_PROMPT,
    build_bullet_rewrite_prompt,
    build_score_explanation_prompt,
)
from src.infrastructure.db.models import ScoreReport as ScoreReportModel


class ScoreReportNotFoundError(Exception):
    pass


async def generate_suggestions(resume_id: str, db: AsyncSession) -> dict:
    result = await db.execute(
        select(ScoreReportModel).where(ScoreReportModel.resume_id == resume_id)
    )
    report_row = result.scalars().first()
    if report_row is None:
        raise ScoreReportNotFoundError(f"Resume {resume_id} hasn't been scored yet — call /score or /analyze first")

    report_data = report_row.section_scores
    bullet_analyses = report_data.get("bullet_analyses", [])
    weak_bullets = [b for b in bullet_analyses if b["score"] < 100][:5]  # cap at 5 to conserve quota

    try:
        router = build_ai_router()
    except NoAIProviderConfiguredError as e:
        return {
            "ai_available": False,
            "message": str(e),
            "bullet_rewrites": [],
            "score_explanation": None,
        }

    bullet_rewrites = []
    for bullet in weak_bullets:
        try:
            rewrite = await router.complete(
                BULLET_REWRITE_SYSTEM_PROMPT,
                build_bullet_rewrite_prompt(bullet["text"], bullet["issues"]),
            )
            bullet_rewrites.append({"original": bullet["text"], "suggested": rewrite.strip()})
        except AIProviderError as e:
            bullet_rewrites.append({"original": bullet["text"], "suggested": None, "error": str(e)})

    try:
        score_explanation = await router.complete(
            SCORE_EXPLANATION_SYSTEM_PROMPT,
            build_score_explanation_prompt(
                report_data.get("section_scores", {}),
                report_row.overall_score,
                report_data.get("cap_reasons", []),
            ),
        )
    except AIProviderError as e:
        score_explanation = f"(AI explanation unavailable: {e})"

    return {
        "ai_available": True,
        "message": None,
        "bullet_rewrites": bullet_rewrites,
        "score_explanation": score_explanation.strip(),
    }