from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.ats_engine.score_report import ScoreReport
from src.infrastructure.db.models import ParsedDocument
from src.infrastructure.db.models import ScoreReport as ScoreReportModel
from src.infrastructure.parsing.scoring.scorer import score_resume as run_scoring


class ParsedDocumentNotFoundError(Exception):
    pass


async def score_resume(resume_id: str, db: AsyncSession) -> ScoreReport:
    result = await db.execute(
        select(ParsedDocument).where(ParsedDocument.resume_id == resume_id)
    )
    parsed = result.scalar_one_or_none()
    if parsed is None:
        raise ParsedDocumentNotFoundError(
            f"Resume {resume_id} hasn't been parsed yet — call /parse first"
        )

    data = parsed.normalized_data
    scoring_result = run_scoring(
        contact_info=data["contact_info"],
        sections=data["sections"],
        word_count=data["word_count"],
    )
    report = ScoreReport(**scoring_result)

    existing = await db.execute(
        select(ScoreReportModel).where(ScoreReportModel.resume_id == resume_id)
    )
    existing_report = existing.scalars().first()

    if existing_report is not None:
        existing_report.overall_score = report.overall_score
        existing_report.section_scores = report.model_dump()
    else:
        db.add(
            ScoreReportModel(
                resume_id=resume_id,
                overall_score=report.overall_score,
                section_scores=report.model_dump(),
            )
        )

    await db.commit()

    return report