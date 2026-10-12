
import HomePage from "../pages/home/HomePage";
import { Routes, Route } from "react-router-dom";
import { CheckoutPage } from "../pages/checkout/CheckoutPage";
import { Orders } from "../pages/orders/Orders";
import { TrackingPage } from "../pages/tracking/TrackingPage";
import { StoreLayout } from "../components/layout/StoreLayout";

/** Maps the storefront, checkout, order, and tracking routes to their pages. */
function App() {
  return (
    <Routes>
      <Route path="/" element={<StoreLayout />}>
        <Route index element={<HomePage />} />
        <Route path="orders" element={<Orders />} />
        <Route path="tracking" element={<TrackingPage />} />
      </Route>
      <Route path="/checkout" element={<CheckoutPage />} />
    </Routes>
  );
}

export default App;
