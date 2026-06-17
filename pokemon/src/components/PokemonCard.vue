<script setup>
import { computed } from 'vue'
import { getPokemonSprite } from '../services/pokeApi'

const props = defineProps({
  pokemon: {
    type: Object,
    required: true,
  },
  isFavorite: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['select-pokemon', 'toggle-favorite'])

const number = computed(() => String(props.pokemon.id).padStart(3, '0'))
const imageUrl = computed(() => getPokemonSprite(props.pokemon.id))

function selectPokemon() {
  emit('select-pokemon', props.pokemon)
}

function toggleFavorite() {
  emit('toggle-favorite', props.pokemon)
}
</script>

<template>
  <li class="mdc-image-list__item pokemon-card" tabindex="0" @click="selectPokemon" @keydown.enter.self="selectPokemon">
    <button
      class="material-icons mdc-icon-button favorite-button"
      type="button"
      :class="{ active: isFavorite }"
      :aria-label="isFavorite ? 'Verwijder uit favorieten' : 'Maak favoriet'"
      @click.stop="toggleFavorite"
    >
      {{ isFavorite ? 'favorite' : 'favorite_border' }}
    </button>

    <img class="mdc-image-list__image" :src="imageUrl" :alt="pokemon.name" loading="lazy">
    <div class="mdc-image-list__supporting">
      <span class="pokemon-id">#{{ number }}</span>
      <span class="pokemon-name">{{ pokemon.name }}</span>
    </div>
  </li>
</template>
