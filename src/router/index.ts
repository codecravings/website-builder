import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/builder',
      name: 'builder',
      component: () => import('@/views/Builder.vue')
    },
    {
      path: '/editor/:id?',
      name: 'editor',
      component: () => import('@/views/Editor.vue')
    }
  ]
})

export default router