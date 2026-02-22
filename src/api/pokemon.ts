export interface Pokemon {
  name: string;
  url: string;
}

export async function getPokemons(): Promise<Pokemon[]> {
  const res = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=100",
  );
  const { results } = await res.json();
  return results;
}
