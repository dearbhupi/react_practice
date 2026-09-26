import { useState, useEffect } from "react";
import Pagination from "./Componenets/Pagination";
import PokemonList from "./Componenets/PokemonList";
import axios from "axios";

function Pokemon() {
  const [pokemonList, setPokemonList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const source = axios.CancelToken.source();

    axios
      .get(`https://pokeapi.co/api/v2/pokemon?limit=10&offset=${(currentPage - 1) * 10}`, {
        cancelToken: source.token,
      })
      .then((response) => {
        setPokemonList(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 10));
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          console.error("Failed to fetch Pokémon:", error);
        }
      });

    return () => {
      source.cancel("Request cancelled on component unmount");
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