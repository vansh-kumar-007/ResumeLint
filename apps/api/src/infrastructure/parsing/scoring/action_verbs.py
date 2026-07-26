STRONG_ACTION_VERBS = {
    "built", "developed", "designed", "implemented", "created", "led", "managed",
    "optimized", "architected", "engineered", "launched", "deployed", "automated",
    "reduced", "increased", "improved", "achieved", "delivered", "established",
    "coordinated", "published", "researched", "analyzed", "constructed",
    "spearheaded", "streamlined", "integrated", "authored", "founded",
    "trained", "mentored", "presented", "negotiated", "resolved", "scaled",
}

WEAK_PHRASES = (
    "responsible for", "worked on", "helped with", "was involved in",
    "duties included", "tasked with", "in charge of", "assisted with",
)


def has_strong_action_start(bullet_text: str) -> bool:
    first_word = bullet_text.strip().split(" ", 1)[0].lower().strip(".,;:")
    return first_word in STRONG_ACTION_VERBS


def has_weak_phrase(bullet_text: str) -> bool:
    lowered = bullet_text.lower()
    return any(phrase in lowered for phrase in WEAK_PHRASES)