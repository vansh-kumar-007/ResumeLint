import uuid
from pathlib import Path

from src.infrastructure.storage.base import StorageBackend


class LocalStorageBackend(StorageBackend):
    def __init__(self, root: str):
        self.root = Path(root)
        self.root.mkdir(parents=True, exist_ok=True)

    async def save(self, content: bytes, filename: str) -> str:
        ext = Path(filename).suffix
        stored_name = f"{uuid.uuid4()}{ext}"
        path = self.root / stored_name
        path.write_bytes(content)
        return str(path)