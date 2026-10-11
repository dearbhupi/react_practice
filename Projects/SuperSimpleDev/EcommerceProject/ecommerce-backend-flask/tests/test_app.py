import tempfile
import unittest
from pathlib import Path

from app import create_app


class EcommerceApiTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.app = create_app(
            {
                "TESTING": True,
                "DATABASE_PATH": str(Path(self.temp_dir.name) / "test.sqlite3"),
            }
        )
        self.client = self.app.test_client()

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_products_can_be_searched_by_name_or_keyword(self):
        by_name = self.client.get("/api/products?search=basketball")
        by_keyword = self.client.get("/api/products?search=toaster")

        self.assertEqual(by_name.status_code, 200)
        self.assertTrue(all("basketball" in item["name"].lower() for item in by_name.json))
        self.assertEqual(len(by_keyword.json), 1)
        self.assertEqual(by_keyword.json[0]["name"], "2 Slot Toaster - White")

    def test_root_shows_api_status_and_endpoints(self):
        response = self.client.get("/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["message"], "Ecommerce Flask API is running")
        self.assertIn("/api/products", response.json["endpoints"])

    def test_cart_validation_expansion_and_update(self):
        initial_cart = self.client.get("/api/cart-items?expand=product")
        self.assertEqual(initial_cart.status_code, 200)
        self.assertEqual(initial_cart.json[0]["product"]["name"], "Black and Gray Athletic Cotton Socks - 6 Pairs")

        invalid = self.client.post(
            "/api/cart-items",
            json={"productId": initial_cart.json[0]["productId"], "quantity": 0},
        )
        self.assertEqual(invalid.status_code, 400)

        updated = self.client.put(
            f"/api/cart-items/{initial_cart.json[0]['productId']}",
            json={"quantity": 3, "deliveryOptionId": "3"},
        )
        self.assertEqual(updated.status_code, 200)
        self.assertEqual(updated.json["quantity"], 3)
        self.assertEqual(updated.json["deliveryOptionId"], "3")

    def test_payment_summary_and_order_creation(self):
        summary = self.client.get("/api/payment-summary")
        self.assertEqual(summary.status_code, 200)
        self.assertEqual(summary.json["totalCostCents"], 5251)

        response = self.client.post("/api/orders")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.json["totalCostCents"], 5251)
        self.assertEqual(self.client.get("/api/cart-items").json, [])

        expanded = self.client.get(f"/api/orders/{response.json['id']}?expand=products")
        self.assertEqual(expanded.status_code, 200)
        self.assertIn("product", expanded.json["products"][0])

    def test_reset_restores_seed_data_and_images_are_served(self):
        reset_response = self.client.post("/api/reset")
        self.assertEqual(reset_response.status_code, 204)
        self.assertEqual(len(self.client.get("/api/cart-items").json), 2)

        image = self.client.get("/images/logo-white.png")
        self.assertEqual(image.status_code, 200)
        self.assertTrue(image.data)
        image.close()

    def test_delivery_options_cart_add_delete_and_order_lookup(self):
        options = self.client.get("/api/delivery-options?expand=estimatedDeliveryTime")
        self.assertEqual(options.status_code, 200)
        self.assertIn("estimatedDeliveryTimeMs", options.json[0])

        product_id = self.client.get("/api/products").json[3]["id"]
        added = self.client.post(
            "/api/cart-items", json={"productId": product_id, "quantity": 1}
        )
        self.assertEqual(added.status_code, 201)
        self.assertEqual(added.json["deliveryOptionId"], "1")

        missing_order = self.client.get("/api/orders/not-an-order")
        self.assertEqual(missing_order.status_code, 404)
        orders = self.client.get("/api/orders?expand=products")
        self.assertEqual(orders.status_code, 200)
        self.assertIn("product", orders.json[0]["products"][0])

        removed = self.client.delete(f"/api/cart-items/{product_id}")
        self.assertEqual(removed.status_code, 204)
        self.assertEqual(removed.data, b"")


if __name__ == "__main__":
    unittest.main()
