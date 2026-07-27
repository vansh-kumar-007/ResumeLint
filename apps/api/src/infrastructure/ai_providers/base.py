from abc import ABC, abstractmethod


class AIProviderError(Exception):
    """Raised when an AI provider fails to return a usable completion."""


class AIProvider(ABC):
    name: str

    @abstractmethod
    async def complete(self, system_prompt: str, user_prompt: str) -> str:
        """Return the model's text completion, or raise AIProviderError."""
        raise NotImplementedError