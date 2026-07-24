import re

# Canonical section name -> keywords that indicate this section (checked as substrings)
SECTION_KEYWORDS: dict[str, list[str]] = {
    "summary": ["summary", "objective", "profile"],
    "education": ["education"],
    "experience": ["experience", "internship", "work history"],
    "projects": ["project"],
    "skills": ["skill"],
    "certifications": ["certification", "training", "course"],
    "achievements": ["achievement", "award", "honor"],
    "positions_of_responsibility": ["position", "responsibility", "leadership"],
    "publications": ["publication"],
    "languages_known": ["languages known", "spoken languages"],
    "extracurricular": ["extra-curricular", "extracurricular", "activities"],
}


def _is_header_line(line: str) -> bool:
    stripped = line.strip()
    if not stripped:
        return False
    if stripped[0] in ("•", "●", "-", "*"):
        return False
    word_count = len(stripped.split())
    if word_count == 0 or word_count > 10:
        return False
    letters_only = re.sub(r"[^A-Za-z]", "", stripped)
    if not letters_only:
        return False
    return letters_only.isupper()


def _canonicalize(header_text: str) -> str:
    lowered = header_text.lower()
    for canonical, keywords in SECTION_KEYWORDS.items():
        if any(keyword in lowered for keyword in keywords):
            return canonical
    # No known match — keep the raw header as its own key rather than discard it
    return header_text.strip().lower().replace(" ", "_")


def detect_sections(cleaned_text: str) -> dict[str, str]:
    lines = cleaned_text.split("\n")
    sections: dict[str, list[str]] = {"header": []}
    current_key = "header"

    for line in lines:
        if _is_header_line(line):
            current_key = _canonicalize(line)
            sections.setdefault(current_key, [])
            continue
        sections[current_key].append(line)

    return {key: "\n".join(content).strip() for key, content in sections.items() if "\n".join(content).strip()}