from src.config.settings import settings
from src.infrastructure.ai_providers.base import AIProvider, AIProviderError
from src.infrastructure.ai_providers.groq_provider import GroqProvider
from src.infrastructure.ai_providers.openrouter_provider import OpenRouterProvider
from src.infrastructure.ai_providers.router import AIProviderRouter


class NoAIProviderConfiguredError(Exception):
    pass


def build_ai_router() -> AIProviderRouter:
    providers: list[AIProvider] = []

    if settings.groq_api_key:
        providers.append(GroqProvider(api_key=settings.groq_api_key, model=settings.groq_model))
    if settings.openrouter_api_key:
        providers.append(
            OpenRouterProvider(api_key=settings.openrouter_api_key, model=settings.openrouter_model)
        )

    if not providers:
        raise NoAIProviderConfiguredError(
            "No AI provider API keys configured. Set GROQ_API_KEY and/or OPENROUTER_API_KEY in .env"
        )

    return AIProviderRouter(providers)


__all__ = ["build_ai_router", "AIProviderError", "NoAIProviderConfiguredError"]