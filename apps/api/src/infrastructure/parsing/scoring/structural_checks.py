REQUIRED_SECTIONS = {
    "education": "Education",
    "skills": "Skills",
}
EXPERIENCE_LIKE_SECTIONS = ["experience", "projects", "internships"]


def check_contact_completeness(contact_info: dict) -> dict:
    issues: list[str] = []
    score = 100

    if not contact_info.get("name"):
        issues.append("No name detected")
        score -= 40
    if not contact_info.get("email"):
        issues.append("No email address detected")
        score -= 35
    if not contact_info.get("phone"):
        issues.append("No phone number detected")
        score -= 25

    return {"score": max(0, score), "issues": issues}


def check_required_sections(sections: dict) -> dict:
    issues: list[str] = []
    score = 100
    present_keys = set(sections.keys())

    for key, label in REQUIRED_SECTIONS.items():
        if key not in present_keys:
            issues.append(f"{label} section not detected")
            score -= 30

    if not any(key in present_keys for key in EXPERIENCE_LIKE_SECTIONS):
        issues.append("No Experience, Projects, or Internships section detected")
        score -= 40

    return {"score": max(0, score), "issues": issues}


def check_resume_length(word_count: int) -> dict:
    issues: list[str] = []
    score = 100

    if word_count < 150:
        issues.append("Resume seems very short — may be underdeveloped")
        score -= 40
    elif word_count > 1200:
        issues.append("Resume seems very long — consider tightening to one page for early-career roles")
        score -= 20

    return {"score": max(0, score), "issues": issues}