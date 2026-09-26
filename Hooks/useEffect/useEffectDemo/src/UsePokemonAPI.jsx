import { useState, useEffect } from "react";
import Pagination from "./PokeComponenets/Pagination";
import PokemonList from "./PokeComponenets/PokemonList";
import axios from "axios";

function Pokemon() {
  const [pokemonList, setPokemonList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    axios
      .get(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${(currentPage - 1) * 10}`, {
        signal: controller.signal,
      })
      .then((response) => {
        setPokemonList(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10));
      })
      .catch((error) => {
        if (error.name !== "CanceledError" && error.name !== "AbortError") {
          console.error("Failed to fetch Pokémon:", error);
        }
      });

    return () => {
      controller.abort();
    };
  }, [currentPage]);

  return (
    <div>
      <PokemonList pokemon={pokemonList} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}

export default Pokemon;