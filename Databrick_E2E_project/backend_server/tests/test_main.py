from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_reports_demo_mode() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "data_source": "demo"}


def test_dashboard_returns_summary_and_seven_days() -> None:
    response = client.get("/api/v1/dashboard")

    assert response.status_code == 200
    payload = response.json()
    assert payload["source"] == "demo"
    assert payload["summary"]["revenue"] > 0
    assert payload["summary"]["orders"] > 0
    assert payload["summary"]["average_order_value"] > 0
    assert len(payload["series"]) == 7
    assert {"date", "revenue", "orders"} <= payload["series"][0].keys()


def test_dashboard_rejects_invalid_date_range() -> None:
    response = client.get("/api/v1/dashboard?days=0")

    assert response.status_code == 422


def test_credit_analysis_returns_aggregated_risk_breakdowns() -> None:
    response = client.get("/api/v1/credit-analysis")

    assert response.status_code == 200
    payload = response.json()
    assert payload["source"] == "demo"
    assert payload["summary"]["application_count"] == 1000
    assert payload["summary"]["bad_count"] + payload["summary"]["good_count"] == 1000
    assert payload["by_purpose"]
    assert payload["by_duration"]
    assert "sex" not in payload
