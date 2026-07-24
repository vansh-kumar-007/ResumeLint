from pydantic import BaseModel


class ParsedDocumentResponse(BaseModel):
    raw_text: str
    word_count: int
    page_or_section_count: int