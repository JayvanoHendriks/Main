import { ref } from 'vue'

const STORAGE_KEY = 'pokemon-favorites'
const favorites = ref([])

function saveFavorites() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value))
}

function normalizePokemon(pokemon) {
  return {
    name: pokemon.name,
    url: pokemon.url || `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`,
    id: pokemon.id,
  }
}

export function loadFavorites() {
  const savedFavorites = localStorage.getItem(STORAGE_KEY)

  if (!savedFavorites) {
    favorites.value = []
    return
  }

  try {
    favorites.value = JSON.parse(savedFavorites)
  } catch {
    favorites.value = []
    saveFavorites()
  }
}

function addFavorite(pokemon) {
  const favorite = normalizePokemon(pokemon)

  if (isFavorite(favorite)) return

  favorites.value = [...favorites.value, favorite]
  saveFavorites()
}

function removeFavorite(pokemon) {
  favorites.value = favorites.value.filter((favorite) => {
    return favorite.id !== pokemon.id && favorite.name !== pokemon.name
  })

  saveFavorites()
}

function toggleFavorite(pokemon) {
  if (isFavorite(pokemon)) {
    removeFavorite(pokemon)
  } else {
    addFavorite(pokemon)
  }
}

function isFavorite(pokemon) {
  if (!pokemon) return false

  return favorites.value.some((favorite) => {
    return favorite.id === pokemon.id || favorite.name === pokemon.name
  })
}

export function useFavorites() {
  if (favorites.value.length === 0) {
    loadFavorites()
  }

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    loadFavorites,
  }
}
