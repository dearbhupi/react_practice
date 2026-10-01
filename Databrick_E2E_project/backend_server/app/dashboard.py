import re
from datetime import date, datetime, timedelta, timezone
from decimal import Decimal

from .settings import get_settings

TABLE_PATTERN = re.compile(r"^[A-Za-z_][A-Za-z0-9_]*\.[A-Za-z_][A-Za-z0-9_]*\.[A-Za-z_][A-Za-z0-9_]*$")


def demo_rows(days: int) -> list[tuple[date, float, int]]:
    revenue = [1840, 2360, 1980, 3120, 2750, 3580, 4210]
    orders = [18, 23, 20, 29, 26, 34, 39]
    today = date.today()
    return [
        (today - timedelta(days=days - index - 1), float(revenue[index % 7]), orders[index % 7])
        for index in range(days)
    ]


def databricks_rows(days: int) -> list[tuple[date, float, int]]:
    settings = get_settings()
    if not all((settings.databricks_server_hostname, settings.databricks_http_path, settings.databricks_access_token)):
        raise RuntimeError("Databricks SQL connection settings are incomplete")
    if not TABLE_PATTERN.fullmatch(settings.databricks_gold_table):
        raise RuntimeError("DATABRICKS_GOLD_TABLE must be a three-part Unity Catalog table name")

    from databricks import sql

    query = f"""
        SELECT order_date, SUM(revenue) AS revenue, SUM(order_count) AS orders
        FROM {settings.databricks_gold_table}
        WHERE order_date >= date_sub(current_date(), ?)
        GROUP BY order_date
        ORDER BY order_date
    """
    with sql.connect(
        server_hostname=settings.databricks_server_hostname,
        http_path=settings.databricks_http_path,
        access_token=settings.databricks_access_token,
    ) as connection:
        with connection.cursor() as cursor:
            cursor.execute(query, [days])
            return [
                (row[0], float(row[1] or 0), int(row[2] or 0))
                for row in cursor.fetchall()
            ]


def get_dashboard_data(days: int = 7) -> dict:
    settings = get_settings()
    rows = demo_rows(days) if settings.data_source == "demo" else databricks_rows(days)
    revenue = sum((Decimal(str(row[1])) for row in rows), Decimal("0"))
    orders = sum(row[2] for row in rows)

    return {
        "source": settings.data_source,
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "summary": {
            "revenue": float(revenue),
            "orders": orders,
            "average_order_value": float(revenue / orders) if orders else 0,
        },
        "series": [
            {"date": row[0].isoformat(), "revenue": row[1], "orders": row[2]}
            for row in rows
        ],
    }
