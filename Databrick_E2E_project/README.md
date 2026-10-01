# SinghInt LLC Sales Analytics

A small end-to-end example with a React dashboard, a FastAPI service, and a Databricks Lakeflow Declarative Pipeline. The API serves demo data by default; switching it to Databricks makes it query the pipeline's Unity Catalog Gold table through a SQL warehouse.

## Project layout

- `client/` - React and Vite dashboard
- `backend_server/` - FastAPI routes, demo provider, Databricks SQL client, and tests
- `databrick/` - Databricks Asset Bundle and sales plus credit Bronze/Silver/Gold pipelines

## Run locally with demo data

Terminal 1:

```sh
cd backend_server
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

Terminal 2:

```sh
cd client
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`). The Vite development server proxies `/api` requests to FastAPI at `http://localhost:8000`.

## Connect Databricks

1. Install and authenticate the Databricks CLI for a workspace with Unity Catalog and serverless pipeline support.
2. Review `databrick/databricks.yml`. The sales pipeline reads the normalized daily data in `workspace.default.fieldnote_sales_source`; the included seven-day rows match the React demo figures. The credit pipeline reads `workspace.default.german_credit_data` with `Age`, `Sex`, `Job`, `Housing`, `Saving accounts`, `Checking account`, `Credit amount`, `Duration`, `Purpose`, and `Risk` columns. It intentionally excludes age and sex from the Silver and Gold analysis tables. Override `credit_source_table` if needed.
3. Run `databrick/seed_sales.sql` in the Databricks SQL Editor to create the sales source table, then deploy and run the pipelines:

```sh
cd databrick
databricks bundle validate -t dev
databricks bundle deploy -t dev
databricks bundle run sales_pipeline -t dev
databricks bundle run credit_pipeline -t dev
```

The pipelines write Gold tables to `workspace.default` by default. The credit pipeline creates `gold_credit_summary`, `gold_credit_by_purpose`, and `gold_credit_by_duration`. Change the catalog/schema bundle variables and matching API table settings together if you use another output location.

The published [Sales Overview dashboard](https://dbc-05835634-9c28.cloud.databricks.com/dashboardsv3/01f1bda6e8ef1597b2dbd26bc573ade4/published?o=2163847751496363) reads from `workspace.default.gold_daily_sales`. The existing German credit dashboard is unchanged.

4. Configure `backend_server/.env` with the SQL warehouse's server hostname, HTTP path, and an access token. Set:

```dotenv
DATA_SOURCE=databricks
DATABRICKS_GOLD_TABLE=workspace.default.gold_daily_sales
DATABRICKS_CREDIT_SUMMARY_TABLE=workspace.default.gold_credit_summary
DATABRICKS_CREDIT_PURPOSE_TABLE=workspace.default.gold_credit_by_purpose
DATABRICKS_CREDIT_DURATION_TABLE=workspace.default.gold_credit_by_duration
```

`DATABRICKS_WORKSPACE_ID` is recorded in `backend_server/.env.example` as a workspace reference. The value `aws:us-east-2:e2b7f0e7-1acb-4276-8c00-72bdc52c5bbf` is not a workspace URL or SQL warehouse HTTP path; obtain those separately from the Databricks workspace. The token is read only by the backend. Do not put Databricks credentials in the React client or commit `.env`.

## API and tests

- `GET /health` reports API health and the configured data source.
- `GET /api/v1/dashboard?days=7` returns summary metrics and daily sales rows. `days` accepts values from 1 through 90.
- `GET /api/v1/credit-analysis` returns historical label rates by purpose and duration; it is descriptive analysis, not a lending decision model.

Run backend tests:

```sh
cd backend_server
.venv/bin/python -m pytest
```

For production, route `/api` from the frontend host to the FastAPI service, configure `FRONTEND_ORIGIN` for the deployed frontend origin, and provide Databricks credentials through the deployment secret manager.
