class AIProvider:
    def summarize(self, text: str) -> str:
        return f"Stub summary: {text[:160]}"


ai_provider = AIProvider()
