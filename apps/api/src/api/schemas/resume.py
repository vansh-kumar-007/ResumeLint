from datetime import datetime

from pydantic import BaseModel


class ResumeUploadResponse(BaseModel):
    id: str
    original_filename: str
    mime_type: str
    file_size_bytes: int
    uploaded_at: datetime

    class Config:
        from_attributes = True