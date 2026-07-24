from pathlib import Path

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.domain.ats_engine.parsed_resume import ContactInfo, ParsedResume
from src.infrastructure.db.models import ParsedDocument, Resume
from src.infrastructure.parsing.contact_extractor import extract_contact_info
from src.infrastructure.parsing.extractor_factory import get_extractor
from src.infrastructure.parsing.section_detector import detect_sections
from src.infrastructure.parsing.text_cleaner import clean_text


class ResumeNotFoundError(Exception):
    pass


async def parse_resume(resume_id: str, db: AsyncSession) -> ParsedResume:
    result = await db.execute(select(Resume).where(Resume.id == resume_id))
    resume = result.scalar_one_or_none()
    if resume is None:
        raise ResumeNotFoundError(f"Resume {resume_id} not found")

    content = Path(resume.storage_path).read_bytes()
    extractor = get_extractor(resume.mime_type)
    extraction = extractor.extract(content)

    cleaned = clean_text(extraction.raw_text)
    sections = detect_sections(cleaned)
    contact_data = extract_contact_info(sections.get("header", ""))

    parsed_resume = ParsedResume(
        raw_text=cleaned,
        word_count=extraction.word_count,
        page_or_section_count=extraction.page_or_section_count,
        contact_info=ContactInfo(**contact_data),
        sections=sections,
    )

    existing = await db.execute(
        select(ParsedDocument).where(ParsedDocument.resume_id == resume.id)
    )
    parsed = existing.scalar_one_or_none()

    if parsed is not None:
        parsed.extracted_text = parsed_resume.raw_text
        parsed.normalized_data = parsed_resume.model_dump()
    else:
        parsed = ParsedDocument(
            resume_id=resume.id,
            extracted_text=parsed_resume.raw_text,
            normalized_data=parsed_resume.model_dump(),
        )
        db.add(parsed)

    await db.commit()

    return parsed_resume