from sqlalchemy.ext.asyncio import AsyncSession

from src.application.ats_engine.parse_resume import parse_resume
from src.application.ats_engine.score_resume import score_resume


async def analyze_resume(resume_id: str, db: AsyncSession) -> dict:
    parsed = await parse_resume(resume_id, db)
    report = await score_resume(resume_id, db)

    return {
        "resume_id": resume_id,
        "contact_info": parsed.contact_info,
        "sections": parsed.sections,
        "word_count": parsed.word_count,
        **report.model_dump(),
    }