from src.api.schemas.parsed_document import ContactInfoResponse
from src.api.schemas.score_report import ScoreReportResponse


class AnalysisResponse(ScoreReportResponse):
    resume_id: str
    contact_info: ContactInfoResponse
    sections: dict[str, str]
    word_count: int