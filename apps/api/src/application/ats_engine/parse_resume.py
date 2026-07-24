from pathlib import Path

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.ats_engine.resume_document import ResumeDocument
from src.infrastructure.db.models import ParsedDocument, Resume
from src.infrastructure.parsing.extractor_factory import get_extractor


class ResumeNotFoundError(Exception):
    pass


async def parse_resume(resume_id: str, db: AsyncSession) -> ResumeDocument:
    result = await db.execute(select(Resume).where(Resume.id == resume_id))
    resume = result.scalar_one_or_none()
    if resume is None:
        raise ResumeNotFoundError(f"Resume {resume_id} not found")

    content = Path(resume.storage_path).read_bytes()
    extractor = get_extractor(resume.mime_type)
    extraction = extractor.extract(content)

    document = ResumeDocument(
        raw_text=extraction.raw_text,
        word_count=extraction.word_count,
        page_or_section_count=extraction.page_or_section_count,
    )

    # Idempotent: update existing ParsedDocument for this resume if present,
    # otherwise create a new one. Re-parsing (e.g. after a bug fix, or user-
    # triggered re-analysis) should never fail with a UNIQUE constraint error.
    existing = await db.execute(
        select(ParsedDocument).where(ParsedDocument.resume_id == resume.id)
    )
    parsed = existing.scalar_one_or_none()

    if parsed is not None:
        parsed.extracted_text = document.raw_text
        parsed.normalized_data = document.model_dump()
    else:
        parsed = ParsedDocument(
            resume_id=resume.id,
            extracted_text=document.raw_text,
            normalized_data=document.model_dump(),
        )
        db.add(parsed)

    await db.commit()

    return document