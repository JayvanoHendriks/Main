  <script setup>
  import { computed, ref } from 'vue'
  import { RouterLink } from 'vue-router'
  import PokemonCard from '../components/PokemonCard.vue'
  import PokemonDetailSheet from '../components/PokemonDetailSheet.vue'
  import { useFavorites } from '../composables/useFavorites'

  const selectedPokemon = ref(null)
  const { favorites, removeFavorite, toggleFavorite, isFavorite } = useFavorites()

  const sortedFavorites = computed(() => {
    return [...favorites.value].sort((a, b) => a.id - b.id)
  })

  function selectPokemon(pokemon) {
    selectedPokemon.value = pokemon
  }

  function closeDetails() {
    selectedPokemon.value = null
  }
  </script>

  <template>
    <section v-if="sortedFavorites.length">
      <ul class="mdc-image-list mdc-image-list--masonry my-masonry-image-list">
        <PokemonCard
          v-for="pokemon in sortedFavorites"
          :key="pokemon.name"
          :pokemon="pokemon"
          :is-favorite="isFavorite(pokemon)"
          @select-pokemon="selectPokemon"
          @toggle-favorite="removeFavorite"
        />
      </ul>
    </section>

    <div v-else class="state-message empty-favorites">
      <i class="material-icons" aria-hidden="true">favorite_border</i>
      <h2>Nog geen favorieten</h2>
      <p>Ga naar Home en tik op het hartje bij een Pokémon.</p>
      <RouterLink class="mdc-button mdc-button--raised app-button" to="/">
        <span class="mdc-button__ripple"></span>
        <span class="mdc-button__focus-ring"></span>
        <span class="mdc-button__label">Naar Home</span>
      </RouterLink>
    </div>

    <PokemonDetailSheet
      :pokemon="selectedPokemon"
      :is-favorite="isFavorite(selectedPokemon)"
      @close="closeDetails"
      @toggle-favorite="toggleFavorite"
    />
  </template>
