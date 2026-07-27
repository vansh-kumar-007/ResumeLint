import httpx

from src.infrastructure.ai_providers.base import AIProvider, AIProviderError


class OpenRouterProvider(AIProvider):
    name = "openrouter"

    def __init__(self, api_key: str, model: str):
        self.api_key = api_key
        self.model = model

    async def complete(self, system_prompt: str, user_prompt: str) -> str:
        try:
            async with httpx.AsyncClient(timeout=20.0) as client:
                response = await client.post(
                    "https://openrouter.ai/api/v1/chat/completions",
                    headers={"Authorization": f"Bearer {self.api_key}"},
                    json={
                        "model": self.model,
                        "messages": [
                            {"role": "system", "content": system_prompt},
                            {"role": "user", "content": user_prompt},
                        ],
                        "temperature": 0.4,
                    },
                )
            response.raise_for_status()
            data = response.json()
            return data["choices"][0]["message"]["content"]
        except (httpx.HTTPError, KeyError, IndexError) as e:
            raise AIProviderError(f"OpenRouter request failed: {e}") from e