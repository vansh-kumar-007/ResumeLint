import pytest

from src.infrastructure.ai_providers.base import AIProvider, AIProviderError
from src.infrastructure.ai_providers.router import AIProviderRouter


class FakeFailingProvider(AIProvider):
    name = "fake_failing"

    async def complete(self, system_prompt: str, user_prompt: str) -> str:
        raise AIProviderError("simulated failure")


class FakeWorkingProvider(AIProvider):
    name = "fake_working"

    async def complete(self, system_prompt: str, user_prompt: str) -> str:
        return "success response"


@pytest.mark.asyncio
async def test_falls_back_to_second_provider_on_first_failure():
    router = AIProviderRouter([FakeFailingProvider(), FakeWorkingProvider()])
    result = await router.complete("system", "user")
    assert result == "success response"


@pytest.mark.asyncio
async def test_raises_when_all_providers_fail():
    router = AIProviderRouter([FakeFailingProvider(), FakeFailingProvider()])
    with pytest.raises(AIProviderError):
        await router.complete("system", "user")


def test_requires_at_least_one_provider():
    with pytest.raises(ValueError):
        AIProviderRouter([])