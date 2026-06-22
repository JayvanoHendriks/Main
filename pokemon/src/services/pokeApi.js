const API_BASE_URL = 'https://pokeapi.co/api/v2'
const SPRITE_BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon'

export function getPokemonIdFromUrl(url) {
  if (!url) return null

  const parts = url.split('/').filter(Boolean)
  const id = Number(parts[parts.length - 1])

  return Number.isNaN(id) ? null : id
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

  return data.results.map((pokemon) => ({
    ...pokemon,
    id: getPokemonIdFromUrl(pokemon.url),
  }))
}

export async function getPokemonDetails(nameOrId) {
  const response = await fetch(`${API_BASE_URL}/pokemon/${nameOrId}`)

  if (!response.ok) {
    throw new Error('De details van deze Pokémon konden niet worden geladen.')
  }

  return response.json()
}
