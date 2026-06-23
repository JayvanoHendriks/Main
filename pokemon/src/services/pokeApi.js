const API_BASE_URL = 'https://pokeapi.co/api/v2'
const SPRITE_BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'

export function getPokemonIdFromUrl(url) {
  return url.split('/')[6]
}

export function getPokemonSprite(id) {
  return `${SPRITE_BASE_URL}/${id}.png`
}

export function getPokemonGif(id) {
  return `${SPRITE_BASE_URL}/other/showdown/${id}.gif`
}

export async function getAllPokemon() {
  const response = await fetch(`${API_BASE_URL}/pokemon?limit=1302`)

  if (!response.ok) {
    throw new Error('De Pokémon lijst kon niet worden geladen.')
  }

  const data = await response.json()

  return data.results
}

export async function getPokemonDetails(nameOrId) {
  const response = await fetch(`${API_BASE_URL}/pokemon/${nameOrId}`)

  if (!response.ok) {
    throw new Error('De details van deze Pokémon konden niet worden geladen.')
  }

  return response.json()
}
