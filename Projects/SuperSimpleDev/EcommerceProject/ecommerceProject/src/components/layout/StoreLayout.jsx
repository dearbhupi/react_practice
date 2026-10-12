import { Outlet } from "react-router-dom";
import { Header } from "./Header";

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
