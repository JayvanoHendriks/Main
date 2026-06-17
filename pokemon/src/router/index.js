import { createRouter, createWebHistory } from 'vue-router'
import Overzicht from '../views/Overzicht.vue'
import Favorieten from '../views/Favorieten.vue'

const routes = [
  {
    path: '/',
    name: 'overzicht',
    component: Overzicht,
  },
  {
    path: '/favorieten',
    name: 'favorieten',
    component: Favorieten,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
