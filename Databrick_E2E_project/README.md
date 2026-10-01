# Fieldnote Sales Analytics

A small end-to-end example with a React dashboard, a FastAPI service, and a Databricks Lakeflow Declarative Pipeline. The API serves demo data by default; switching it to Databricks makes it query the pipeline's Unity Catalog Gold table through a SQL warehouse.

## Project layout

- `client/` - React and Vite dashboard
- `backend_server/` - FastAPI routes, demo provider, Databricks SQL client, and tests
- `databrick/` - Databricks Asset Bundle and Bronze/Silver/Gold pipeline

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
2. Review `databrick/databricks.yml`. The default input is Databricks' `samples.tpch.orders`; override `source_table` if you use a different table with the TPC-H order columns `o_orderdate`, `o_orderkey`, `o_custkey`, and `o_totalprice`.
3. Deploy and run the pipeline:

```sh
cd databrick
databricks bundle validate -t dev
databricks bundle deploy -t dev
databricks bundle run sales_pipeline -t dev
```

The pipeline writes `main.e2e_analytics.gold_daily_sales` by default. The catalog and schema can be changed with bundle variables; keep the API table setting in sync.

4. Configure `backend_server/.env` with the SQL warehouse's server hostname, HTTP path, and an access token. Set:

```dotenv
DATA_SOURCE=databricks
DATABRICKS_GOLD_TABLE=main.e2e_analytics.gold_daily_sales
```

`DATABRICKS_WORKSPACE_ID` is recorded in `backend_server/.env.example` as a workspace reference. The value `aws:us-east-2:e2b7f0e7-1acb-4276-8c00-72bdc52c5bbf` is not a workspace URL or SQL warehouse HTTP path; obtain those separately from the Databricks workspace. The token is read only by the backend. Do not put Databricks credentials in the React client or commit `.env`.

## API and tests

- `GET /health` reports API health and the configured data source.
- `GET /api/v1/dashboard?days=7` returns summary metrics and daily sales rows. `days` accepts values from 1 through 90.

Run backend tests:

```sh
cd backend_server
.venv/bin/python -m pytest
```

For production, route `/api` from the frontend host to the FastAPI service, configure `FRONTEND_ORIGIN` for the deployed frontend origin, and provide Databricks credentials through the deployment secret manager.
