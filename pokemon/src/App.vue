<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const drawerOpen = ref(false)
const installPrompt = ref(null)
const showInstallSnackbar = ref(false)
let installSnackbarTimer = null

const pageTitle = computed(() => {
  return route.name === 'favorieten' ? 'Favorieten' : 'Home'
})

const showSearchButton = computed(() => {
  return route.name === 'overzicht'
})

function openenSide() {
  drawerOpen.value = true
}

function closeDrawer() {
  drawerOpen.value = false
}

function toggleSearch() {
  window.dispatchEvent(new CustomEvent('toggle-pokemon-search'))
}

function onBeforeInstallPrompt(event) {
  event.preventDefault()
  installPrompt.value = event

  window.setTimeout(() => {
    if (installPrompt.value) {
      openInstallSnackbar()
    }
  }, 2000)
}

async function installApp() {
  if (!installPrompt.value) return

  closeInstallSnackbar()
  installPrompt.value.prompt()
  await installPrompt.value.userChoice
  installPrompt.value = null
}

function openInstallSnackbar() {
  window.clearTimeout(installSnackbarTimer)
  showInstallSnackbar.value = true

  installSnackbarTimer = window.setTimeout(() => {
    showInstallSnackbar.value = false
  }, 5000)
}

function closeInstallSnackbar() {
  window.clearTimeout(installSnackbarTimer)
  showInstallSnackbar.value = false
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  window.clearTimeout(installSnackbarTimer)
})
</script>

<template>
  <div
    class="mdc-snackbar mdc-snackbar--leading install-snackbar"
    :class="{ 'mdc-snackbar--open': showInstallSnackbar }"
  >
    <div class="mdc-snackbar__surface" role="status" aria-relevant="additions">
      <div class="mdc-snackbar__label" aria-atomic="false">
        Pokédex downloaden naar je apparaat?
      </div>
      <div class="mdc-snackbar__actions" aria-atomic="true">
        <button class="mdc-button mdc-snackbar__action" type="button" @click="installApp">
          <span class="mdc-button__ripple"></span>
          <span class="mdc-button__label">Download</span>
        </button>
        <button
          class="material-icons mdc-icon-button mdc-snackbar__dismiss"
          type="button"
          title="Sluiten"
          aria-label="Sluiten"
          @click="closeInstallSnackbar"
        >
          close
        </button>
      </div>
    </div>
  </div>

  <aside class="mdc-drawer mdc-drawer--modal" :class="{ 'mdc-drawer--open': drawerOpen }">
    <div class="mdc-drawer__logo-container">
      <div class="drawer-pokedex-logo" aria-hidden="true">
        <span></span>
      </div>
    </div>
    <div class="mdc-drawer__header">
      <h3 class="mdc-drawer__title">Pokédex</h3>
      <h6 class="mdc-drawer__subtitle">Pokémon API app</h6>
    </div>
    <div class="mdc-drawer__content">
      <nav class="mdc-list">
        <RouterLink class="mdc-list-item" to="/" tabindex="0" @click="closeDrawer">
          <span class="mdc-list-item__ripple"></span>
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">home</i>
          <span class="mdc-list-item__text">Home</span>
        </RouterLink>
        <RouterLink class="mdc-list-item" to="/favorieten" tabindex="0" @click="closeDrawer">
          <span class="mdc-list-item__ripple"></span>
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">favorite</i>
          <span class="mdc-list-item__text">Favorieten</span>
        </RouterLink>
      </nav>
    </div>
  </aside>
  <div class="mdc-drawer-scrim" :class="{ show: drawerOpen }" @click="closeDrawer"></div>

  <header class="mdc-top-app-bar">
    <div class="mdc-top-app-bar__row">
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
        <button
          class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button"
          type="button"
          aria-label="Open navigation menu"
          @click="openenSide"
        >
          menu
        </button>
        <RouterLink class="mdc-top-app-bar__title" to="/">{{ pageTitle }}</RouterLink>
      </section>
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
        <RouterLink class="material-icons mdc-top-app-bar__action-item mdc-icon-button" to="/favorieten" aria-label="Favorite">
          favorite
        </RouterLink>
        <button
          v-if="showSearchButton"
          class="material-icons mdc-top-app-bar__action-item mdc-icon-button app-search-button"
          type="button"
          aria-label="Search"
          @click="toggleSearch"
        >
          search
        </button>
      </section>
    </div>
  </header>

  <router-view />
</template>
