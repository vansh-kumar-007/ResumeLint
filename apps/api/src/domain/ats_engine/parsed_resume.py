from pydantic import BaseModel


class ContactInfo(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    linkedin_url: str | None = None
    github_url: str | None = None
    portfolio_url: str | None = None
    has_linkedin_mention: bool = False
    has_github_mention: bool = False


class ParsedResume(BaseModel):
    raw_text: str
    word_count: int
    page_or_section_count: int
    contact_info: ContactInfo
    sections: dict[str, str]