import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../views/LoginView.vue'
import LayoutView from '@/views/LayoutView.vue'
import HomeView from '@/views/HomeView.vue'
import SignupView from '@/views/SignupView.vue'
import axios from '@/plugins/axios'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/home',
      component: LayoutView,
      meta: {
        requiresAuth: true, // Đánh dấu route này yêu cầu xác thực
      },
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

router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) return next()

  try {
    await axios.get('/auth/verify-token') // access token còn hạn
    return next()
  } catch (error) {
    try {
      // Nếu access token hết hạn, thử refresh
      await axios.post('/auth/refresh-token', null)

      // Sau khi refresh thành công, retry verify
      await axios.get('/auth/verify-token')
      return next(localStorage.getItem('redirectAfterLogin') || '/home')
    } catch (err) {
      console.error('Token expired or invalid', err)
      return next('/login')
    }
  }
})

export default router
