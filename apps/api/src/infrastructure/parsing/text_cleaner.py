import re

BULLET_CHARS = ["●", "•", "◦", "▪", "‣"]


def clean_text(raw_text: str) -> str:
    text = raw_text

    # Normalize tabs/multiple spaces to a single space, but preserve newlines
    text = re.sub(r"[ \t]+", " ", text)

    # Standalone bullet glyphs on their own line -> drop the line, they add no info
    lines = [line.strip() for line in text.split("\n")]
    lines = [line for line in lines if line not in BULLET_CHARS]

    # Bullet glyphs stuck mid-word (PDF extraction artifact, e.g. "A●g nirva") ->
    # remove the glyph and rejoin, since it's noise, not real content
    cleaned_lines = []
    for line in lines:
        for bullet in BULLET_CHARS:
            line = line.replace(bullet, " ")
        line = re.sub(r"\s+", " ", line).strip()
        if line:
            cleaned_lines.append(line)

    return "\n".join(cleaned_lines)