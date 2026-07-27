from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.schemas.analysis import AnalysisResponse
from src.api.schemas.parsed_document import ParsedDocumentResponse
from src.api.schemas.resume import ResumeUploadResponse
from src.api.schemas.score_report import ScoreReportResponse
from src.application.ats_engine.analyze_resume import analyze_resume
from src.application.ats_engine.parse_resume import ResumeNotFoundError, parse_resume
from src.application.ats_engine.score_resume import ParsedDocumentNotFoundError, score_resume
from src.config.settings import settings
from src.infrastructure.db.models import Resume
from src.infrastructure.db.session import get_db
from src.infrastructure.parsing.file_validation import validate_file
from src.infrastructure.storage import storage_backend
from src.api.schemas.suggestions import SuggestionsResponse
from src.application.ats_engine.generate_suggestions import ScoreReportNotFoundError, generate_suggestions

router = APIRouter(prefix="/resumes", tags=["resumes"])


@router.post("/upload", response_model=ResumeUploadResponse, status_code=201)
async def upload_resume(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db),
):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided")

    # Read in chunks to enforce size limit without trusting Content-Length
    chunks: list[bytes] = []
    total_size = 0
    while chunk := await file.read(1024 * 1024):
        total_size += len(chunk)
        if total_size > settings.max_upload_size_bytes:
            raise HTTPException(
                status_code=413,
                detail=f"File exceeds maximum size of {settings.max_upload_size_bytes // (1024 * 1024)} MB",
            )
        chunks.append(chunk)
    content = b"".join(chunks)

    if total_size == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    result = validate_file(file.filename, content)
    if not result.valid:
        raise HTTPException(status_code=415, detail=result.reason)

    storage_path = await storage_backend.save(content, file.filename)

    resume = Resume(
        original_filename=file.filename,
        storage_path=storage_path,
        mime_type=result.detected_mime,
        file_size_bytes=total_size,
    )
    db.add(resume)
    await db.commit()
    await db.refresh(resume)

    return resume

@router.post("/{resume_id}/parse", response_model=ParsedDocumentResponse)
async def parse_resume_endpoint(resume_id: str, db: AsyncSession = Depends(get_db)):
    try:
        document = await parse_resume(resume_id, db)
    except ResumeNotFoundError:
        raise HTTPException(status_code=404, detail="Resume not found")
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    return document

@router.post("/{resume_id}/score", response_model=ScoreReportResponse)
async def score_resume_endpoint(resume_id: str, db: AsyncSession = Depends(get_db)):
    try:
        report = await score_resume(resume_id, db)
    except ParsedDocumentNotFoundError as e:
        raise HTTPException(status_code=422, detail=str(e))

    return report

@router.post("/{resume_id}/analyze", response_model=AnalysisResponse)
async def analyze_resume_endpoint(resume_id: str, db: AsyncSession = Depends(get_db)):
    try:
        result = await analyze_resume(resume_id, db)
    except ResumeNotFoundError:
        raise HTTPException(status_code=404, detail="Resume not found")
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    return result

@router.post("/{resume_id}/suggestions", response_model=SuggestionsResponse)
async def suggestions_endpoint(resume_id: str, db: AsyncSession = Depends(get_db)):
    try:
        result = await generate_suggestions(resume_id, db)
    except ScoreReportNotFoundError as e:
        raise HTTPException(status_code=422, detail=str(e))

    return result

