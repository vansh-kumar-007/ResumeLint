import re

EMAIL_RE = re.compile(r"[\w.+-]+@[\w-]+\.[\w.-]+")
PHONE_RE = re.compile(r"\+?\d[\d\s-]{8,14}\d")
URL_RE = re.compile(r"https?://\S+")


def extract_contact_info(header_text: str) -> dict[str, str | bool | None]:
    email_match = EMAIL_RE.search(header_text)
    phone_match = PHONE_RE.search(header_text)
    urls = URL_RE.findall(header_text)

    lowered = header_text.lower()

    def find_url_for(keyword: str) -> str | None:
        for url in urls:
            if keyword in url.lower():
                return url
        return None

    # First non-empty line is treated as the name — true for the vast majority
    # of resume formats, which lead with the candidate's name.
    first_line = next((line.strip() for line in header_text.split("\n") if line.strip()), None)

    return {
        "name": first_line,
        "email": email_match.group(0) if email_match else None,
        "phone": phone_match.group(0) if phone_match else None,
        "linkedin_url": find_url_for("linkedin"),
        "github_url": find_url_for("github"),
        "portfolio_url": next((u for u in urls if "linkedin" not in u.lower() and "github" not in u.lower()), None),
        "has_linkedin_mention": "linkedin" in lowered,
        "has_github_mention": "github" in lowered,
    }