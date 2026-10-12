import { Outlet } from "react-router-dom";
import { Header } from "./Header";

/** Provides the shared navigation shell for storefront routes. */
export function StoreLayout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}
