<script setup>
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { getPokemonDetails, getPokemonGif, getPokemonSprite } from '../services/pokeApi'

const props = defineProps(['pokemon', 'isFavorite'])

const emit = defineEmits(['close', 'toggle-favorite'])

const details = ref(null)
const loading = ref(false)
const error = ref('')

const selectedName = computed(() => props.pokemon?.name || '')
const displayPokemon = computed(() => details.value || props.pokemon)
const imageUrl = computed(() => {
  if (!displayPokemon.value?.id) return ''
  return getPokemonGif(displayPokemon.value.id)
})


watch(
  () => props.pokemon,
  async (pokemon) => {
    details.value = null
    error.value = ''

    document.body.classList.toggle('no-scroll', Boolean(pokemon))

    if (!pokemon) return

    loading.value = true

    try {
      details.value = await getPokemonDetails(pokemon.name || pokemon.id)
    } catch (fetchError) {
      error.value = fetchError.message
    } finally {
      loading.value = false
    }
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  document.body.classList.remove('no-scroll')
})

function closeSheet() {
  emit('close')
}

function toggleFavorite() {
  emit('toggle-favorite', displayPokemon.value)
}

function statName(name) {
  const names = {
    hp: 'HP',
    attack: 'Atk',
    defense: 'Def',
    'special-attack': 'Sp.Atk',
    'special-defense': 'Sp.Def',
    speed: 'Speed',
  }

  return names[name] || name
}



</script>

<template>
  <section class="sheet" :class="{ 'sheet-out-of-view': !pokemon }">
    <header class="mdc-top-app-bar">
      <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
          <button
            class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button"
            type="button"
            aria-label="Close"
            @click="closeSheet"
          >
            close
          </button>
          <span class="mdc-top-app-bar__title">{{ selectedName || 'Details' }}</span>
        </section>
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
          <button
            class="material-icons mdc-top-app-bar__action-item mdc-icon-button"
            type="button"
            aria-label="Favorite"
            @click="toggleFavorite"
          >
            {{ isFavorite ? 'favorite' : 'favorite_border' }}
          </button>
        </section>
      </div>
    </header>

    <main>
      <div v-if="loading" class="sheet-state">Details worden geladen...</div>
      <div v-else-if="error" class="sheet-state">{{ error }}</div>

      <article v-else-if="details" class="pokemon-details-panel">
        <div class="sheet-image-frame">
          <img class="sheet-image" :src="imageUrl" :alt="details.name">
        </div>

        <section class="detail-info">
          <div class="detail-heading">
            <span>#{{ String(details.id).padStart(3, '0') }}</span>
            <h2>{{ details.name }}</h2>
          </div>

          <div class="type-badges">
            <span
              v-for="typeItem in details.types"
              :key="typeItem.type.name"
              class="type-badge"
              :class="`type-${typeItem.type.name}`"
            >
              {{ typeItem.type.name }}
            </span>
          </div>

          <h3>Abilities</h3>
          <div class="ability-list">
            <span v-for="ability in details.abilities" :key="ability.ability.name">
              {{ ability.ability.name }}
            </span>
          </div>

          <h3>Base stats</h3>
          <div class="stats-list">
            <div v-for="stat in details.stats" :key="stat.stat.name" class="stat-row">
              <span>{{ statName(stat.stat.name) }}</span>
              <strong>{{ stat.base_stat }}</strong>
            </div>
          </div>
        </section>
      </article>
    </main>
  </section>
</template>
