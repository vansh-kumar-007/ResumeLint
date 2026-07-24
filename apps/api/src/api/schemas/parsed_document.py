from pydantic import BaseModel


class ContactInfoResponse(BaseModel):
    name: str | None
    email: str | None
    phone: str | None
    linkedin_url: str | None
    github_url: str | None
    portfolio_url: str | None
    has_linkedin_mention: bool
    has_github_mention: bool


class ParsedDocumentResponse(BaseModel):
    raw_text: str
    word_count: int
    page_or_section_count: int
    contact_info: ContactInfoResponse
    sections: dict[str, str]