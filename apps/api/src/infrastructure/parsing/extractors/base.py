from abc import ABC, abstractmethod
from dataclasses import dataclass


@dataclass
class ExtractionResult:
    raw_text: str
    page_or_section_count: int
    word_count: int


class TextExtractor(ABC):
    @abstractmethod
    def extract(self, content: bytes) -> ExtractionResult:
        raise NotImplementedError