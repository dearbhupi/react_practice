# Ecommerce Flask Backend

This is a Python/Flask replacement for the neighboring Express backend. It keeps
the existing `/api` endpoints and response field names. The original Node
backend remains unchanged.

## Run

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app.py
```

The API listens on `http://localhost:5000` by default. Set `PORT` to change the
port and `DATABASE_PATH` to choose the SQLite database file. Seed products and
demo orders are loaded automatically into a new or empty database.

Product images are served from `/images/...` using the copied files in
`static/images`.

## API

- `GET /api/products?search=...` (matches product names and keywords)
- `GET /api/delivery-options?expand=estimatedDeliveryTime`
- `GET|POST /api/cart-items`
- `GET|PUT|DELETE /api/cart-items/<productId>`
- `GET|POST /api/orders`
- `GET /api/orders/<orderId>`
- `GET /api/payment-summary`
- `POST /api/reset` (replaces database contents with the demo seed data)

## Tests

```sh
python3 -m unittest discover -s tests -v
```
