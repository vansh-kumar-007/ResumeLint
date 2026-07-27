from src.infrastructure.parsing.scoring.bullet_analyzer import analyze_bullet, split_into_bullets


def test_strong_bullet_scores_high():
    result = analyze_bullet("Built a full-stack app serving 10,000+ users with 99.9% uptime.")
    assert result["score"] == 100
    assert result["has_action_verb"] is True
    assert result["has_metric"] is True
    assert result["issues"] == []


def test_weak_phrase_penalized():
    result = analyze_bullet("Responsible for managing the team and handling various tasks daily.")
    assert any("weak" in issue.lower() for issue in result["issues"])


def test_no_metric_penalized():
    result = analyze_bullet("Built a web application for internal team use across departments.")
    assert result["has_metric"] is False
    assert any("metric" in issue.lower() for issue in result["issues"])


def test_title_lines_excluded_from_bullets():
    section = "CyberArena RL | Multi-Agent Adversarial RL GitHub | Live | API\nBuilt a self-play RL simulation using Double DQN across 12 attack types."
    bullets = split_into_bullets(section)
    assert len(bullets) == 1
    assert "Built a self-play" in bullets[0]


def test_tech_stack_tag_lines_excluded():
    section = "Python, PyTorch, FastAPI, React\nBuilt a self-play RL simulation using Double DQN across 12 attack types."
    bullets = split_into_bullets(section)
    assert len(bullets) == 1
    
def test_merges_wrapped_continuation_lines():
    section = (
        "Conducted field-based environmental surveys across Delhi-NCR to map open waste burning and dumping hotspots, collecting GPS,\n"
        "waste composition, and land-use data for air quality assessment."
    )
    bullets = split_into_bullets(section)
    assert len(bullets) == 1
    assert "collecting GPS, waste composition" in bullets[0]