from dataclasses import dataclass

ALLOWED_TYPES = {
    "application/pdf": {"ext": ".pdf", "magic": [b"%PDF"]},
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
        "ext": ".docx",
        "magic": [b"PK\x03\x04"],  # DOCX is a zip archive
    },
    "text/plain": {"ext": ".txt", "magic": None},  # validated by decode attempt instead
}


@dataclass
class ValidationResult:
    valid: bool
    detected_mime: str | None
    reason: str | None = None


def validate_file(filename: str, content: bytes) -> ValidationResult:
    ext = "." + filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

    if ext == ".pdf":
        if content.startswith(b"%PDF"):
            return ValidationResult(True, "application/pdf")
        return ValidationResult(
            False, None, "File extension is .pdf but content doesn't match a PDF signature"
        )

    if ext == ".docx":
        if content.startswith(b"PK\x03\x04"):
            return ValidationResult(
                True, "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            )
        return ValidationResult(
            False, None, "File extension is .docx but content doesn't match a DOCX/zip signature"
        )

    if ext == ".txt":
        try:
            content.decode("utf-8")
            return ValidationResult(True, "text/plain")
        except UnicodeDecodeError:
            return ValidationResult(False, None, "File extension is .txt but content isn't valid UTF-8 text")

    return ValidationResult(False, None, f"Unsupported file extension: '{ext}'. Allowed: .pdf, .docx, .txt")