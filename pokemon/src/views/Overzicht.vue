<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import PokemonCard from '../components/PokemonCard.vue'
import PokemonDetailSheet from '../components/PokemonDetailSheet.vue'
import { useFavorites } from '../composables/useFavorites'
import { getAllPokemon } from '../services/pokeApi'

const allPokemon = ref([])
const loading = ref(true)
const error = ref('')
const searchTerm = ref('')
const showSearch = ref(false)
const searchInput = ref(null)
const page = ref(1)
const pageSize = 20
const selectedPokemon = ref(null)

const { toggleFavorite, isFavorite } = useFavorites()

const filteredPokemon = computed(() => {
  const search = searchTerm.value.trim().toLowerCase()

  if (!search) return allPokemon.value

  return allPokemon.value.filter((pokemon) => pokemon.name.includes(search))
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredPokemon.value.length / pageSize))
})

const visiblePokemon = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredPokemon.value.slice(start, start + pageSize)
})

watch(searchTerm, () => {
  page.value = 1
})

watch(totalPages, () => {
  if (page.value > totalPages.value) {
    page.value = totalPages.value
  }
})

async function toggleSearchField() {
  showSearch.value = !showSearch.value

  if (showSearch.value) {
    await nextTick()
    searchInput.value?.focus()
  } else {
    searchTerm.value = ''
  }
}

onMounted(async () => {
  window.addEventListener('toggle-pokemon-search', toggleSearchField)

  try {
    allPokemon.value = await getAllPokemon()
  } catch (fetchError) {
    error.value = fetchError.message
  } finally {
    loading.value = false
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('toggle-pokemon-search', toggleSearchField)
})

function previousPage() {
  if (page.value > 1) {
    page.value--
  }
}

function nextPage() {
  if (page.value < totalPages.value) {
    page.value++
  }
}

function selectPokemon(pokemon) {
  selectedPokemon.value = pokemon
}

function closeDetails() {
  selectedPokemon.value = null
}
</script>

<template>
  <section v-if="showSearch" class="search-strip" id="zoeken">
    <label class="mdc-text-field mdc-text-field--filled search-field">
      <span class="material-icons search-icon" aria-hidden="true">search</span>
      <input
        ref="searchInput"
        v-model="searchTerm"
        class="mdc-text-field__input"
        type="search"
        placeholder="Zoek Pokémon"
      >
      <span class="mdc-line-ripple"></span>
    </label>
  </section>

  <section>
    <div v-if="loading" class="state-message">Pokémon worden geladen...</div>
    <div v-else-if="error" class="state-message error-message">{{ error }}</div>

    <ul v-else-if="visiblePokemon.length" class="mdc-image-list mdc-image-list--masonry my-masonry-image-list">
      <PokemonCard
        v-for="pokemon in visiblePokemon"
        :key="pokemon.name"
        :pokemon="pokemon"
        :is-favorite="isFavorite(pokemon)"
        @select-pokemon="selectPokemon"
        @toggle-favorite="toggleFavorite"
      />
    </ul>

    <div v-else class="state-message">
      Geen Pokémon gevonden.
    </div>
  </section>

  <nav class="page-buttons" aria-label="Paginatie">
    <button
      class="mdc-button mdc-button--outlined app-button"
      type="button"
      :disabled="page === 1"
      @click="previousPage"
    >
      <span class="mdc-button__ripple"></span>
      <span class="mdc-button__focus-ring"></span>
      <span class="mdc-button__label">Vorige</span>
    </button>
    <button
      class="mdc-button mdc-button--raised app-button"
      type="button"
      :disabled="page === totalPages"
      @click="nextPage"
    >
      <span class="mdc-button__ripple"></span>
      <span class="mdc-button__focus-ring"></span>
      <span class="mdc-button__label">Volgende</span>
    </button>
  </nav>

  <PokemonDetailSheet
    :pokemon="selectedPokemon"
    :is-favorite="isFavorite(selectedPokemon)"
    @close="closeDetails"
    @toggle-favorite="toggleFavorite"
  />
</template>
