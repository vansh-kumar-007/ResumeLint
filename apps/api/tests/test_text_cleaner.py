from src.infrastructure.parsing.text_cleaner import clean_text


def test_removes_standalone_bullet_lines():
    raw = "●\nSome bullet content here"
    result = clean_text(raw)
    assert "●" not in result
    assert "Some bullet content here" in result


def test_removes_mid_word_bullet_artifacts():
    raw = "A●g nirva AI Internship"
    result = clean_text(raw)
    assert "●" not in result


def test_collapses_repeated_whitespace():
    raw = "Hello\t\t\tworld"
    result = clean_text(raw)
    assert "Hello world" in result


def test_preserves_newlines():
    raw = "Line one\nLine two"
    result = clean_text(raw)
    assert result.count("\n") == 1