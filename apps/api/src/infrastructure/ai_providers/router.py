import logging

from src.infrastructure.ai_providers.base import AIProvider, AIProviderError

logger = logging.getLogger(__name__)


class AIProviderRouter:
    """Tries providers in order, falling back to the next on failure.
    Implements ADR-004: no single provider is a point of failure."""

    def __init__(self, providers: list[AIProvider]):
        if not providers:
            raise ValueError("At least one AI provider must be configured")
        self.providers = providers

    async def complete(self, system_prompt: str, user_prompt: str) -> str:
        last_error: Exception | None = None
        for provider in self.providers:
            try:
                return await provider.complete(system_prompt, user_prompt)
            except AIProviderError as e:
                logger.warning("AI provider '%s' failed, trying next: %s", provider.name, e)
                last_error = e
        raise AIProviderError(f"All AI providers failed. Last error: {last_error}")