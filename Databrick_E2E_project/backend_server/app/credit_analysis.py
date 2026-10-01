import re
from datetime import datetime, timezone

from .settings import get_settings

TABLE_PATTERN = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*\.[A-Za-z_][A-Za-z0-9_]*\.[A-Za-z_][A-Za-z0-9_]*$")

DEMO_ANALYSIS = {
    "summary": {
        "application_count": 1000,
        "good_count": 700,
        "bad_count": 300,
        "bad_rate": 0.30,
        "avg_credit_amount": 3271.26,
        "avg_duration": 20.9,
    },
    "by_purpose": [
        {"purpose": "car", "application_count": 337, "bad_count": 106, "bad_rate": 0.315},
        {"purpose": "radio/tv", "application_count": 280, "bad_count": 62, "bad_rate": 0.221},
        {"purpose": "furniture/equipment", "application_count": 181, "bad_count": 58, "bad_rate": 0.320},
        {"purpose": "business", "application_count": 97, "bad_count": 34, "bad_rate": 0.351},
        {"purpose": "education", "application_count": 59, "bad_count": 23, "bad_rate": 0.390},
        {"purpose": "repairs / other", "application_count": 46, "bad_count": 17, "bad_rate": 0.370},
    ],
    "by_duration": [
        {"duration_band": "Short · 1–12 mo", "application_count": 149, "bad_count": 27, "bad_rate": 0.181},
        {"duration_band": "Medium · 13–36 mo", "application_count": 728, "bad_count": 217, "bad_rate": 0.298},
        {"duration_band": "Long · 37+ mo", "application_count": 123, "bad_count": 56, "bad_rate": 0.455},
    ],
}


def _databricks_analysis() -> dict:
    settings = get_settings()
    if not all((settings.databricks_server_hostname, settings.databricks_http_path, settings.databricks_access_token)):
        raise RuntimeError("Databricks SQL connection settings are incomplete")

    tables = (
        settings.databricks_credit_summary_table,
        settings.databricks_credit_purpose_table,
        settings.databricks_credit_duration_table,
    )
    if not all(TABLE_PATTERN.fullmatch(table) for table in tables):
        raise RuntimeError("Credit Gold table settings must be three-part Unity Catalog names")

    from databricks import sql

    queries = (
        f"SELECT application_count, good_count, bad_count, bad_rate, avg_credit_amount, avg_duration FROM {tables[0]}",
        f"SELECT purpose, application_count, bad_count, bad_rate FROM {tables[1]} ORDER BY bad_rate DESC",
        f"SELECT duration_band, application_count, bad_count, bad_rate FROM {tables[2]} ORDER BY bad_rate",
    )
    with sql.connect(
        server_hostname=settings.databricks_server_hostname,
        http_path=settings.databricks_http_path,
        access_token=settings.databricks_access_token,
    ) as connection:
        results = []
        for query in queries:
            with connection.cursor() as cursor:
                cursor.execute(query)
                results.append(cursor.fetchall())

    summary_rows, purpose_rows, duration_rows = results
    if not summary_rows:
        raise RuntimeError("Credit summary Gold table is empty; run the credit pipeline first")

    summary = summary_rows[0]
    return {
        "summary": {
            "application_count": int(summary[0] or 0),
            "good_count": int(summary[1] or 0),
            "bad_count": int(summary[2] or 0),
            "bad_rate": float(summary[3] or 0),
            "avg_credit_amount": float(summary[4] or 0),
            "avg_duration": float(summary[5] or 0),
        },
        "by_purpose": [
            {"purpose": row[0], "application_count": int(row[1]), "bad_count": int(row[2]), "bad_rate": float(row[3])}
            for row in purpose_rows
        ],
        "by_duration": [
            {"duration_band": row[0], "application_count": int(row[1]), "bad_count": int(row[2]), "bad_rate": float(row[3])}
            for row in duration_rows
        ],
    }


def get_credit_analysis() -> dict:
    settings = get_settings()
    analysis = DEMO_ANALYSIS if settings.data_source == "demo" else _databricks_analysis()
    return {
        "source": settings.data_source,
        "updated_at": datetime.now(timezone.utc).isoformat(),
        **analysis,
    }