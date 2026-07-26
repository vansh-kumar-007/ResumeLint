from src.infrastructure.parsing.scoring.scorer import score_resume


def _base_contact():
    return {"name": "Jane Doe", "email": "jane@example.com", "phone": "+1 555 555 5555"}


def test_missing_contact_caps_score():
    result = score_resume(
        contact_info={"name": "Jane Doe", "email": None, "phone": None},
        sections={"education": "...", "skills": "...", "experience": "Built something great with 10x improvement."},
        word_count=300,
    )
    assert result["overall_score"] <= 50
    assert any("no email or phone" in reason.lower() for reason in result["cap_reasons"])


def test_no_bullets_caps_score():
    result = score_resume(
        contact_info=_base_contact(),
        sections={"education": "...", "skills": "..."},
        word_count=300,
    )
    assert result["overall_score"] <= 60


def test_strong_resume_scores_well():
    result = score_resume(
        contact_info=_base_contact(),
        sections={
            "education": "Delhi Technological University",
            "skills": "Python, SQL, JavaScript",
            "experience": "Built a full-stack app serving 10,000+ users with 99.9% uptime, reducing latency by 40%.",
        },
        word_count=400,
    )
    assert result["overall_score"] >= 80
    assert result["cap_reasons"] == []