from src.config.settings import settings
from src.infrastructure.storage.local import LocalStorageBackend

storage_backend = LocalStorageBackend(root=settings.storage_root)