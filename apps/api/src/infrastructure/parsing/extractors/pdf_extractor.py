import io

import pdfplumber

from src.infrastructure.parsing.extractors.base import ExtractionResult, TextExtractor


class PdfExtractor(TextExtractor):
    def extract(self, content: bytes) -> ExtractionResult:
        text_parts: list[str] = []
        with pdfplumber.open(io.BytesIO(content)) as pdf:
            page_count = len(pdf.pages)
            for page in pdf.pages:
                page_text = page.extract_text() or ""
                text_parts.append(page_text)

        raw_text = "\n\n".join(text_parts).strip()

        if not raw_text:
            raise ValueError(
                "No extractable text found in PDF. This usually means it's a scanned "
                "image PDF rather than a text-based PDF. OCR support is not yet implemented."
            )

        return ExtractionResult(
            raw_text=raw_text,
            page_or_section_count=page_count,
            word_count=len(raw_text.split()),
        )