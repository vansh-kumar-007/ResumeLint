from abc import ABC, abstractmethod


class StorageBackend(ABC):
    @abstractmethod
    async def save(self, content: bytes, filename: str) -> str:
        """Persist content, return a storage_path reference."""
        raise NotImplementedError