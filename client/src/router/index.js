import { createRouter, createWebHistory } from 'vue-router'
import Main from '../components/Main.vue'
import fourOhFour from '../components/404Page.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Main',
      component: Main
    },
    {
      path: '/room/:id?',
      name: 'Room',
      component: () => import('../components/Room.vue'),
      path: '/room/'
    },
    // {
    //   path: '/room',
    //   name: 'Room',
    //   component: () => import('../components/Room.vue'),
    //   alias: '/room'
    // },
    {
      path: '/:catchAll(.*)',
      name: '404',
      component: fourOhFour
    }
  ]
})

export default router
