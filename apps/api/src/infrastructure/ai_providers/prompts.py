BULLET_REWRITE_SYSTEM_PROMPT = """You are a resume writing expert. You will be given one bullet \
point from a resume along with the specific issues detected in it. Rewrite it to fix those issues \
while staying truthful to the original content — never invent facts, numbers, or achievements that \
weren't in the original. Keep it to one sentence. Respond with ONLY the rewritten bullet, no preamble, \
no quotes, no explanation."""

SCORE_EXPLANATION_SYSTEM_PROMPT = """You are a friendly resume coach talking to a student or early-career \
job seeker. You will be given a structured resume score breakdown. Explain it in 3-4 plain-language \
sentences: what's working well, and what the single most impactful improvement would be. Be encouraging \
but honest. Do not repeat raw numbers back verbatim — translate them into plain English."""


def build_bullet_rewrite_prompt(bullet_text: str, issues: list[str]) -> str:
    issues_str = "; ".join(issues) if issues else "general improvement"
    return f"Bullet: \"{bullet_text}\"\nIssues found: {issues_str}"


def build_score_explanation_prompt(section_scores: dict, overall_score: float, cap_reasons: list[str]) -> str:
    return (
        f"Overall score: {overall_score}/100\n"
        f"Cap reasons: {cap_reasons or 'none'}\n"
        f"Section scores: {section_scores}"
    )