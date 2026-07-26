import re

from src.infrastructure.parsing.scoring.action_verbs import has_strong_action_start, has_weak_phrase

METRIC_RE = re.compile(
    r"\b\d+[\d,.]*\s*(%|percent|x|ms|fps|k|m|\+)?\b|\b(million|thousand|billion)\b",
    re.IGNORECASE,
)


def _is_title_or_metadata_line(line: str) -> bool:
    if " | " in line:
        return True
    # Tech-stack tag lines: short, comma-separated tokens, no sentence
    # punctuation (e.g. "Python, PyTorch, FastAPI, React")
    if "," in line and not line.rstrip().endswith((".", ")")):
        tokens = [t.strip() for t in line.split(",")]
        if all(len(t.split()) <= 3 for t in tokens) and len(line.split()) <= 12:
            return True
    return False


def split_into_bullets(section_text: str) -> list[str]:
    lines = [line.strip() for line in section_text.split("\n") if line.strip()]
    bullets: list[str] = []
    for line in lines:
        content = line[1:].strip() if line.startswith("•") else line
        if len(content.split()) < 5:
            continue
        if _is_title_or_metadata_line(content):
            continue
        bullets.append(content)
    return bullets


def analyze_bullet(bullet_text: str) -> dict:
    word_count = len(bullet_text.split())
    has_action_verb = has_strong_action_start(bullet_text)
    is_weak = has_weak_phrase(bullet_text)
    has_metric = bool(METRIC_RE.search(bullet_text))

    issues: list[str] = []
    score = 100

    if not has_action_verb:
        issues.append("Doesn't start with a strong action verb")
        score -= 25
    if is_weak:
        issues.append("Contains a weak/passive phrase (e.g. 'responsible for')")
        score -= 20
    if not has_metric:
        issues.append("No quantifiable metric or number included")
        score -= 25
    if word_count < 6:
        issues.append("Very short — may lack sufficient detail")
        score -= 15
    elif word_count > 45:
        issues.append("Very long — consider splitting into two bullets")
        score -= 10

    return {
        "text": bullet_text,
        "score": max(0, score),
        "word_count": word_count,
        "has_action_verb": has_action_verb,
        "has_metric": has_metric,
        "issues": issues,
    }