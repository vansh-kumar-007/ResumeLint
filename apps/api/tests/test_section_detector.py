from src.infrastructure.parsing.section_detector import detect_sections


def test_first_line_always_treated_as_header():
    text = "JOHN SMITH\nSome contact info\nEDUCATION\nSome education content"
    sections = detect_sections(text)
    assert "JOHN SMITH" in sections["header"]
    assert "Some contact info" in sections["header"]
    assert "john_smith" not in sections


def test_detects_known_section_headers():
    text = "JOHN SMITH\nEDUCATION\nSome education content\nSKILLS\nPython, SQL"
    sections = detect_sections(text)
    assert "education" in sections
    assert "skills" in sections
    assert "Python, SQL" in sections["skills"]


def test_unknown_header_kept_not_discarded():
    text = "JOHN SMITH\nRANDOM UNKNOWN SECTION\nSome content here"
    sections = detect_sections(text)
    total_content = " ".join(sections.values())
    assert "Some content here" in total_content


def test_bullet_lines_never_treated_as_headers():
    text = "JOHN SMITH\nEDUCATION\n• Not a header despite being short"
    sections = detect_sections(text)
    assert "Not a header despite being short" in sections["education"]