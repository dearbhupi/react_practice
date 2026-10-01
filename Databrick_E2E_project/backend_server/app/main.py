import logging
from typing import Annotated

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from .dashboard import get_dashboard_data
from .settings import get_settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
settings = get_settings()

app = FastAPI(title="Fieldnote Analytics API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["*"]
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "data_source": settings.data_source}


@app.get("/api/v1/dashboard")
def dashboard(days: Annotated[int, Query(ge=1, le=90)] = 7) -> dict:
    try:
        return get_dashboard_data(days)
    except Exception as error:
        logger.exception("Dashboard data request failed")
        raise HTTPException(status_code=503, detail="Unable to load dashboard data") from error
