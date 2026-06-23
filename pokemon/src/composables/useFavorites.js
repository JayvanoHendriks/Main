import { ref } from 'vue'

const STORAGE_KEY = 'pokemon-favorites'

const favorites = ref([])

function saveFavorites() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value))
}

function loadFavorites() {
  const savedFavorites = localStorage.getItem(STORAGE_KEY)

  if (savedFavorites) {
    favorites.value = JSON.parse(savedFavorites)
  }
}

function isFavorite(pokemon) {
  if (!pokemon) return false

  return favorites.value.some((favorite) => favorite.name === pokemon.name)
}

function toggleFavorite(pokemon) {
  if (!pokemon) return

  if (isFavorite(pokemon)) {
    favorites.value = favorites.value.filter((favorite) => {
      return favorite.name !== pokemon.name
    })
  } else {
    favorites.value.push({
      name: pokemon.name,
      id: pokemon.id,
      url: pokemon.url || `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/`,
    })
  }

  saveFavorites()
}

export function useFavorites() {
  loadFavorites()

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  }
}