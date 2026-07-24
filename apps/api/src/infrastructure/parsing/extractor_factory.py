from src.infrastructure.parsing.extractors.base import TextExtractor
from src.infrastructure.parsing.extractors.docx_extractor import DocxExtractor
from src.infrastructure.parsing.extractors.pdf_extractor import PdfExtractor
from src.infrastructure.parsing.extractors.txt_extractor import TxtExtractor

_EXTRACTORS: dict[str, TextExtractor] = {
    "application/pdf": PdfExtractor(),
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": DocxExtractor(),
    "text/plain": TxtExtractor(),
}


def get_extractor(mime_type: str) -> TextExtractor:
    extractor = _EXTRACTORS.get(mime_type)
    if extractor is None:
        raise ValueError(f"No extractor registered for mime type: {mime_type}")
    return extractor