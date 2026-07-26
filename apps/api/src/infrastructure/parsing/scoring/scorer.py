from src.infrastructure.parsing.scoring.bullet_analyzer import analyze_bullet, split_into_bullets
from src.infrastructure.parsing.scoring.structural_checks import (
    EXPERIENCE_LIKE_SECTIONS,
    check_contact_completeness,
    check_required_sections,
    check_resume_length,
)

WEIGHTS = {
    "contact": 0.15,
    "sections": 0.20,
    "length": 0.10,
    "bullet_quality": 0.35,
    "skills_presence": 0.20,
}


def score_resume(contact_info: dict, sections: dict, word_count: int) -> dict:
    contact_check = check_contact_completeness(contact_info)
    sections_check = check_required_sections(sections)
    length_check = check_resume_length(word_count)

    all_bullets: list[dict] = []
    for key in EXPERIENCE_LIKE_SECTIONS:
        if key in sections:
            for bullet_text in split_into_bullets(sections[key]):
                all_bullets.append(analyze_bullet(bullet_text))

    bullet_quality_score = (
        sum(b["score"] for b in all_bullets) / len(all_bullets) if all_bullets else 0
    )

    skills_presence_score = 100 if sections.get("skills") else 0

    weighted_overall = (
        contact_check["score"] * WEIGHTS["contact"]
        + sections_check["score"] * WEIGHTS["sections"]
        + length_check["score"] * WEIGHTS["length"]
        + bullet_quality_score * WEIGHTS["bullet_quality"]
        + skills_presence_score * WEIGHTS["skills_presence"]
    )

    # Hard caps (per ADR-011) — a high average shouldn't mask a critical gap
    capped_overall = weighted_overall
    cap_reasons: list[str] = []

    if not contact_info.get("email") and not contact_info.get("phone"):
        capped_overall = min(capped_overall, 50)
        cap_reasons.append(
            "Score capped at 50: no email or phone found — recruiters cannot contact this candidate"
        )

    if not all_bullets:
        capped_overall = min(capped_overall, 60)
        cap_reasons.append("Score capped at 60: no scoreable experience/project bullets found")

    return {
        "overall_score": round(capped_overall, 1),
        "cap_reasons": cap_reasons,
        "section_scores": {
            "contact": contact_check,
            "sections_present": sections_check,
            "length": length_check,
            "bullet_quality": {
                "score": round(bullet_quality_score, 1),
                "bullets_analyzed": len(all_bullets),
            },
            "skills_presence": {"score": skills_presence_score},
        },
        "bullet_analyses": all_bullets,
    }