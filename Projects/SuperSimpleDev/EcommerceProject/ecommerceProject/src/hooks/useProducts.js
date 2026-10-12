import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../services/productsService";

/** Fetches products for the current URL search query with abort-safe state. */
export function useProducts() {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search")?.trim() ?? "";
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    /** Requests the current query and retains explicit loading/error state. */
    async function loadProducts() {
      try {
        setProducts(await getProducts(search, controller.signal));
      } catch (requestError) {
        if (controller.signal.aborted) return;

        console.error("Error fetching products:", requestError);
        setError("Unable to load products. Please try again later.");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadProducts();
    return () => controller.abort();
  }, [search]);

  return { products, isLoading, error };
}
