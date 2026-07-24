from src.infrastructure.parsing.extractors.base import ExtractionResult, TextExtractor


class TxtExtractor(TextExtractor):
    def extract(self, content: bytes) -> ExtractionResult:
        raw_text = content.decode("utf-8").strip()

        if not raw_text:
            raise ValueError("Text file is empty.")

        return ExtractionResult(
            raw_text=raw_text,
            page_or_section_count=1,
            word_count=len(raw_text.split()),
        )