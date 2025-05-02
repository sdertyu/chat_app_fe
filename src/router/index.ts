import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue';
import LayoutView from '@/views/LayoutView.vue';
import HomeView from '@/views/HomeView.vue';
import SignupView from '@/views/SignupView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: "/home",
      component: LayoutView,
      children: [
        {
          path: 'home',
          component: HomeView,
        },
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
        path: '/signup',
        component: SignupView,
      },
  ],
})

export default router
