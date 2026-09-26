
import React from "react";

function PokemonList({ pokemon }) {
  return (
    <ul>
      {pokemon.map((poke) => (
        <li key={poke.name}>{poke.name}</li>
      ))}
    </ul>
  );
}

export default PokemonList;