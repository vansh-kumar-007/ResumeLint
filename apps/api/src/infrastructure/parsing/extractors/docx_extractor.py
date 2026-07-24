import io

from docx import Document
from docx.document import Document as DocumentObject
from docx.oxml.table import CT_Tbl
from docx.oxml.text.paragraph import CT_P
from docx.table import Table, _Cell
from docx.text.paragraph import Paragraph

from src.infrastructure.parsing.extractors.base import ExtractionResult, TextExtractor


def _iter_block_items(parent):
    """Yield paragraphs and tables in the order they appear in the document body,
    including inside table cells (tables can be nested)."""
    if isinstance(parent, DocumentObject):
        parent_elm = parent.element.body
    elif isinstance(parent, _Cell):
        parent_elm = parent._tc
    else:
        raise ValueError("Unsupported parent type for block iteration")

    for child in parent_elm.iterchildren():
        if isinstance(child, CT_P):
            yield Paragraph(child, parent)
        elif isinstance(child, CT_Tbl):
            yield Table(child, parent)


def _extract_table_text(table: Table) -> list[str]:
    lines: list[str] = []
    for row in table.rows:
        for cell in row.cells:
            for block in _iter_block_items(cell):
                if isinstance(block, Paragraph) and block.text.strip():
                    lines.append(block.text.strip())
                elif isinstance(block, Table):
                    lines.extend(_extract_table_text(block))
    return lines


class DocxExtractor(TextExtractor):
    def extract(self, content: bytes) -> ExtractionResult:
        doc = Document(io.BytesIO(content))

        lines: list[str] = []
        block_count = 0
        for block in _iter_block_items(doc):
            block_count += 1
            if isinstance(block, Paragraph):
                if block.text.strip():
                    lines.append(block.text.strip())
            elif isinstance(block, Table):
                lines.extend(_extract_table_text(block))

        raw_text = "\n".join(lines).strip()

        if not raw_text:
            raise ValueError("No extractable text found in DOCX file.")

        return ExtractionResult(
            raw_text=raw_text,
            page_or_section_count=block_count,
            word_count=len(raw_text.split()),
        )