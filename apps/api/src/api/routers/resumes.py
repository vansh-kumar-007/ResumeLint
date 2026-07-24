from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession

from src.api.schemas.resume import ResumeUploadResponse
from src.config.settings import settings
from src.infrastructure.db.models import Resume
from src.infrastructure.db.session import get_db
from src.infrastructure.parsing.file_validation import validate_file
from src.infrastructure.storage import storage_backend

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