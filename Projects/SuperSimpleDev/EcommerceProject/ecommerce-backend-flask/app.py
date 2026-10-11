import json
import math
import os
import sqlite3
import time
import uuid
from datetime import datetime, timezone
from pathlib import Path

from flask import Flask, g, jsonify, request, send_from_directory


BASE_DIR = Path(__file__).resolve().parent
SEED_DATA_PATH = BASE_DIR / "seed_data.json"


def create_app(test_config=None):
    app = Flask(__name__, static_folder="static")
    app.config.from_mapping(
        DATABASE_PATH=os.environ.get("DATABASE_PATH", str(BASE_DIR / "ecommerce.sqlite3")),
        IMAGE_FOLDER=str(BASE_DIR / "static" / "images"),
    )
    if test_config:
        app.config.update(test_config)

    @app.after_request
    def add_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "*"
        response.headers["Access-Control-Allow-Methods"] = "DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT"
        return response

    def connect_db():
        connection = sqlite3.connect(app.config["DATABASE_PATH"])
        connection.row_factory = sqlite3.Row
        connection.execute("PRAGMA foreign_keys = ON")
        return connection

    def get_db():
        if "db" not in g:
            g.db = connect_db()
        return g.db

    @app.teardown_appcontext
    def close_db(_error=None):
        connection = g.pop("db", None)
        if connection is not None:
            connection.close()

    def now_iso():
        return datetime.now(timezone.utc).isoformat(timespec="milliseconds").replace("+00:00", "Z")

    def product_json(row):
        if row is None:
            return None
        return {
            "id": row["id"],
            "image": row["image"],
            "name": row["name"],
            "rating": json.loads(row["rating"]),
            "priceCents": row["priceCents"],
            "keywords": json.loads(row["keywords"]),
            "createdAt": row["createdAt"],
            "updatedAt": row["updatedAt"],
        }

    def cart_item_json(row, expand_product=False):
        item = {
            "id": row["id"],
            "productId": row["productId"],
            "quantity": row["quantity"],
            "deliveryOptionId": row["deliveryOptionId"],
            "createdAt": row["createdAt"],
            "updatedAt": row["updatedAt"],
        }
        if expand_product:
            product = get_db().execute(
                "SELECT * FROM products WHERE id = ?", (row["productId"],)
            ).fetchone()
            item["product"] = product_json(product)
        return item

    def order_json(row, expand_products=False):
        order = {
            "id": row["id"],
            "orderTimeMs": row["orderTimeMs"],
            "totalCostCents": row["totalCostCents"],
            "products": json.loads(row["products"]),
            "createdAt": row["createdAt"],
            "updatedAt": row["updatedAt"],
        }
        if expand_products:
            for item in order["products"]:
                product = get_db().execute(
                    "SELECT * FROM products WHERE id = ?", (item["productId"],)
                ).fetchone()
                item["product"] = product_json(product)
        return order

    def insert_seed_data(connection):
        seeds = json.loads(SEED_DATA_PATH.read_text(encoding="utf-8"))
        timestamp = time.time()
        for index, product in enumerate(seeds["products"]):
            created = datetime.fromtimestamp(timestamp + index / 1000, timezone.utc)
            created_at = created.isoformat(timespec="milliseconds").replace("+00:00", "Z")
            connection.execute(
                """INSERT INTO products
                   (id, image, name, rating, priceCents, keywords, createdAt, updatedAt)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    product["id"],
                    product["image"],
                    product["name"],
                    json.dumps(product["rating"]),
                    product["priceCents"],
                    json.dumps(product["keywords"]),
                    created_at,
                    created_at,
                ),
            )

        for option in seeds["deliveryOptions"]:
            created_at = now_iso()
            connection.execute(
                """INSERT INTO delivery_options
                   (id, deliveryDays, priceCents, createdAt, updatedAt)
                   VALUES (?, ?, ?, ?, ?)""",
                (option["id"], option["deliveryDays"], option["priceCents"], created_at, created_at),
            )

        for item in seeds["cartItems"]:
            created_at = now_iso()
            connection.execute(
                """INSERT INTO cart_items
                   (id, productId, quantity, deliveryOptionId, createdAt, updatedAt)
                   VALUES (?, ?, ?, ?, ?, ?)""",
                (
                    str(uuid.uuid4()),
                    item["productId"],
                    item["quantity"],
                    item["deliveryOptionId"],
                    created_at,
                    created_at,
                ),
            )

        for order in seeds["orders"]:
            created_at = now_iso()
            connection.execute(
                """INSERT INTO orders
                   (id, orderTimeMs, totalCostCents, products, createdAt, updatedAt)
                   VALUES (?, ?, ?, ?, ?, ?)""",
                (
                    order["id"],
                    order["orderTimeMs"],
                    order["totalCostCents"],
                    json.dumps(order["products"]),
                    created_at,
                    created_at,
                ),
            )

    def initialize_database():
        db_path = Path(app.config["DATABASE_PATH"])
        if str(db_path) != ":memory:":
            db_path.parent.mkdir(parents=True, exist_ok=True)
        connection = connect_db()
        try:
            connection.executescript(
                """
                CREATE TABLE IF NOT EXISTS products (
                    id TEXT PRIMARY KEY,
                    image TEXT NOT NULL,
                    name TEXT NOT NULL,
                    rating TEXT NOT NULL,
                    priceCents INTEGER NOT NULL,
                    keywords TEXT NOT NULL,
                    createdAt TEXT,
                    updatedAt TEXT
                );
                CREATE TABLE IF NOT EXISTS delivery_options (
                    id TEXT PRIMARY KEY,
                    deliveryDays INTEGER NOT NULL,
                    priceCents INTEGER NOT NULL,
                    createdAt TEXT,
                    updatedAt TEXT
                );
                CREATE TABLE IF NOT EXISTS cart_items (
                    id TEXT PRIMARY KEY,
                    productId TEXT NOT NULL REFERENCES products(id),
                    quantity INTEGER NOT NULL,
                    deliveryOptionId TEXT NOT NULL REFERENCES delivery_options(id),
                    createdAt TEXT,
                    updatedAt TEXT,
                    UNIQUE(productId)
                );
                CREATE TABLE IF NOT EXISTS orders (
                    id TEXT PRIMARY KEY,
                    orderTimeMs INTEGER NOT NULL,
                    totalCostCents INTEGER NOT NULL,
                    products TEXT NOT NULL,
                    createdAt TEXT,
                    updatedAt TEXT
                );
                """
            )
            product_count = connection.execute("SELECT COUNT(*) FROM products").fetchone()[0]
            if product_count == 0:
                insert_seed_data(connection)
            connection.commit()
        finally:
            connection.close()

    initialize_database()

    @app.get("/images/<path:filename>")
    def images(filename):
        return send_from_directory(app.config["IMAGE_FOLDER"], filename)

    @app.get("/")
    def index():
        return jsonify(
            message="Ecommerce Flask API is running",
            endpoints=[
                "/api/products",
                "/api/delivery-options",
                "/api/cart-items",
                "/api/orders",
                "/api/payment-summary",
                "/api/reset",
            ],
        )

    @app.get("/api/products")
    def list_products():
        search = request.args.get("search", "").strip().casefold()
        rows = get_db().execute("SELECT * FROM products ORDER BY createdAt ASC").fetchall()
        products = [product_json(row) for row in rows]
        if search:
            products = [
                product
                for product in products
                if search in product["name"].casefold()
                or any(search in keyword.casefold() for keyword in product["keywords"])
            ]
        return jsonify(products)

    @app.get("/api/delivery-options")
    def list_delivery_options():
        db = get_db()
        rows = db.execute("SELECT * FROM delivery_options ORDER BY createdAt ASC").fetchall()
        expand = request.args.get("expand") == "estimatedDeliveryTime"
        now_ms = int(time.time() * 1000)
        result = []
        for row in rows:
            option = dict(row)
            if expand:
                option["estimatedDeliveryTimeMs"] = now_ms + option["deliveryDays"] * 24 * 60 * 60 * 1000
            result.append(option)
        return jsonify(result)

    @app.get("/api/cart-items")
    def list_cart_items():
        rows = get_db().execute("SELECT * FROM cart_items ORDER BY createdAt ASC").fetchall()
        expand = request.args.get("expand") == "product"
        return jsonify([cart_item_json(row, expand) for row in rows])

    @app.post("/api/cart-items")
    def add_cart_item():
        body = request.get_json(silent=True)
        if not isinstance(body, dict):
            return jsonify(error="A JSON request body is required"), 400
        product_id = body.get("productId")
        quantity = body.get("quantity")
        db = get_db()
        if not isinstance(product_id, str) or db.execute(
            "SELECT 1 FROM products WHERE id = ?", (product_id,)
        ).fetchone() is None:
            return jsonify(error="Product not found"), 400
        if type(quantity) is not int or not 1 <= quantity <= 10:
            return jsonify(error="Quantity must be a number between 1 and 10"), 400

        current = db.execute(
            "SELECT * FROM cart_items WHERE productId = ?", (product_id,)
        ).fetchone()
        timestamp = now_iso()
        if current:
            db.execute(
                "UPDATE cart_items SET quantity = ?, updatedAt = ? WHERE id = ?",
                (current["quantity"] + quantity, timestamp, current["id"]),
            )
            item_id = current["id"]
        else:
            item_id = str(uuid.uuid4())
            db.execute(
                """INSERT INTO cart_items
                   (id, productId, quantity, deliveryOptionId, createdAt, updatedAt)
                   VALUES (?, ?, ?, '1', ?, ?)""",
                (item_id, product_id, quantity, timestamp, timestamp),
            )
        db.commit()
        row = db.execute("SELECT * FROM cart_items WHERE id = ?", (item_id,)).fetchone()
        return jsonify(cart_item_json(row)), 201

    @app.put("/api/cart-items/<product_id>")
    def update_cart_item(product_id):
        body = request.get_json(silent=True)
        if not isinstance(body, dict):
            return jsonify(error="A JSON request body is required"), 400
        db = get_db()
        row = db.execute("SELECT * FROM cart_items WHERE productId = ?", (product_id,)).fetchone()
        if row is None:
            return jsonify(error="Cart item not found"), 404

        quantity = body.get("quantity")
        delivery_option_id = body.get("deliveryOptionId")
        if quantity is not None and (type(quantity) is not int or quantity < 1):
            return jsonify(error="Quantity must be a number greater than 0"), 400
        if delivery_option_id is not None and not isinstance(delivery_option_id, str):
            delivery_option_id = str(delivery_option_id)
        if delivery_option_id is not None and db.execute(
            "SELECT 1 FROM delivery_options WHERE id = ?", (delivery_option_id,)
        ).fetchone() is None:
            return jsonify(error="Invalid delivery option"), 400

        updates = []
        values = []
        if quantity is not None:
            updates.append("quantity = ?")
            values.append(quantity)
        if delivery_option_id is not None:
            updates.append("deliveryOptionId = ?")
            values.append(delivery_option_id)
        if updates:
            updates.append("updatedAt = ?")
            values.extend((now_iso(), row["id"]))
            db.execute(f"UPDATE cart_items SET {', '.join(updates)} WHERE id = ?", values)
            db.commit()
        updated = db.execute("SELECT * FROM cart_items WHERE id = ?", (row["id"],)).fetchone()
        return jsonify(cart_item_json(updated))

    @app.delete("/api/cart-items/<product_id>")
    def remove_cart_item(product_id):
        db = get_db()
        cursor = db.execute("DELETE FROM cart_items WHERE productId = ?", (product_id,))
        if cursor.rowcount == 0:
            db.rollback()
            return jsonify(error="Cart item not found"), 404
        db.commit()
        return "", 204

    @app.get("/api/orders")
    def list_orders():
        rows = get_db().execute("SELECT * FROM orders ORDER BY orderTimeMs DESC").fetchall()
        expand = request.args.get("expand") == "products"
        return jsonify([order_json(row, expand) for row in rows])

    @app.post("/api/orders")
    def create_order():
        db = get_db()
        cart_items = db.execute("SELECT * FROM cart_items ORDER BY createdAt ASC").fetchall()
        if not cart_items:
            return jsonify(error="Cart is empty"), 400

        order_products = []
        total_cost_cents = 0
        delivery_deadline = int(time.time() * 1000)
        for item in cart_items:
            product = db.execute(
                "SELECT * FROM products WHERE id = ?", (item["productId"],)
            ).fetchone()
            option = db.execute(
                "SELECT * FROM delivery_options WHERE id = ?", (item["deliveryOptionId"],)
            ).fetchone()
            if product is None:
                return jsonify(error=f"Product not found: {item['productId']}"), 500
            if option is None:
                return jsonify(error=f"Invalid delivery option: {item['deliveryOptionId']}"), 500
            total_cost_cents += product["priceCents"] * item["quantity"] + option["priceCents"]
            order_products.append(
                {
                    "productId": item["productId"],
                    "quantity": item["quantity"],
                    "estimatedDeliveryTimeMs": delivery_deadline
                    + option["deliveryDays"] * 24 * 60 * 60 * 1000,
                }
            )

        total_cost_cents = math.floor(total_cost_cents * 1.1 + 0.5)
        timestamp_ms = int(time.time() * 1000)
        timestamp = now_iso()
        order_id = str(uuid.uuid4())
        db.execute(
            """INSERT INTO orders
               (id, orderTimeMs, totalCostCents, products, createdAt, updatedAt)
               VALUES (?, ?, ?, ?, ?, ?)""",
            (
                order_id,
                timestamp_ms,
                total_cost_cents,
                json.dumps(order_products),
                timestamp,
                timestamp,
            ),
        )
        db.execute("DELETE FROM cart_items")
        db.commit()
        row = db.execute("SELECT * FROM orders WHERE id = ?", (order_id,)).fetchone()
        return jsonify(order_json(row)), 201

    @app.get("/api/orders/<order_id>")
    def get_order(order_id):
        row = get_db().execute("SELECT * FROM orders WHERE id = ?", (order_id,)).fetchone()
        if row is None:
            return jsonify(error="Order not found"), 404
        return jsonify(order_json(row, request.args.get("expand") == "products"))

    @app.get("/api/payment-summary")
    def payment_summary():
        db = get_db()
        rows = db.execute("SELECT * FROM cart_items ORDER BY createdAt ASC").fetchall()
        total_items = product_cost_cents = shipping_cost_cents = 0
        for item in rows:
            product = db.execute(
                "SELECT priceCents FROM products WHERE id = ?", (item["productId"],)
            ).fetchone()
            option = db.execute(
                "SELECT priceCents FROM delivery_options WHERE id = ?", (item["deliveryOptionId"],)
            ).fetchone()
            if product is None or option is None:
                return jsonify(error="Cart contains an invalid product or delivery option"), 500
            total_items += item["quantity"]
            product_cost_cents += product["priceCents"] * item["quantity"]
            shipping_cost_cents += option["priceCents"]

        before_tax = product_cost_cents + shipping_cost_cents
        tax = math.floor(before_tax * 0.1 + 0.5)
        return jsonify(
            totalItems=total_items,
            productCostCents=product_cost_cents,
            shippingCostCents=shipping_cost_cents,
            totalCostBeforeTaxCents=before_tax,
            taxCents=tax,
            totalCostCents=before_tax + tax,
        )

    @app.post("/api/reset")
    def reset_database():
        db = get_db()
        db.execute("DELETE FROM cart_items")
        db.execute("DELETE FROM orders")
        db.execute("DELETE FROM delivery_options")
        db.execute("DELETE FROM products")
        insert_seed_data(db)
        db.commit()
        return "", 204

    @app.errorhandler(500)
    def internal_server_error(error):
        app.logger.error("Unhandled server error: %s", error)
        return jsonify(error="Something went wrong!"), 500

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", "5000")))
