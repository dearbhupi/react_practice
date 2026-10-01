from functools import lru_cache
from typing import Literal

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    data_source: Literal["demo", "databricks"] = "demo"
    frontend_origin: str = "http://localhost:5173"
    databricks_workspace_id: str | None = None
    databricks_server_hostname: str | None = None
    databricks_http_path: str | None = None
    databricks_access_token: str | None = None
    databricks_gold_table: str = "main.e2e_analytics.gold_daily_sales"


@lru_cache
def get_settings() -> Settings:
    return Settings()
