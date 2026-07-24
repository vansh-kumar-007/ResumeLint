from pydantic import BaseModel


class ResumeDocument(BaseModel):
    """Domain representation of a parsed resume, before section detection (T007)."""

    raw_text: str
    word_count: int
    page_or_section_count: int