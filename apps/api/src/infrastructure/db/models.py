import uuid
from datetime import datetime, timezone

from sqlalchemy import ForeignKey, JSON, String, Text, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.infrastructure.db.base import Base


def _uuid() -> str:
    return str(uuid.uuid4())


def _now() -> datetime:
    return datetime.now(timezone.utc)


class Resume(Base):
    __tablename__ = "resumes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    original_filename: Mapped[str] = mapped_column(String(255))
    storage_path: Mapped[str] = mapped_column(String(512))
    mime_type: Mapped[str] = mapped_column(String(100))
    file_size_bytes: Mapped[int]
    uploaded_at: Mapped[datetime] = mapped_column(default=_now)

    parsed_document: Mapped["ParsedDocument | None"] = relationship(
        back_populates="resume", uselist=False, cascade="all, delete-orphan"
    )
    score_reports: Mapped[list["ScoreReport"]] = relationship(
        back_populates="resume", cascade="all, delete-orphan"
    )


class ParsedDocument(Base):
    __tablename__ = "parsed_documents"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    resume_id: Mapped[str] = mapped_column(ForeignKey("resumes.id"), unique=True)
    extracted_text: Mapped[str] = mapped_column(Text)
    normalized_data: Mapped[dict] = mapped_column(JSON)
    parsed_at: Mapped[datetime] = mapped_column(default=_now)

    resume: Mapped["Resume"] = relationship(back_populates="parsed_document")


class ScoreReport(Base):
    __tablename__ = "score_reports"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=_uuid)
    resume_id: Mapped[str] = mapped_column(ForeignKey("resumes.id"))
    overall_score: Mapped[float] = mapped_column(Float)
    section_scores: Mapped[dict] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(default=_now)

    resume: Mapped["Resume"] = relationship(back_populates="score_reports")