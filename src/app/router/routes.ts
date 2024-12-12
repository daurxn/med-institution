import type { RouteRecordRaw } from 'vue-router'
import Doctors from '@/pages/doctors/ui/Doctors.vue'

export const routes: RouteRecordRaw[] = [
  {
    name: 'home',
    path: '/',
    redirect: { name: 'doctors' },
  },
  {
    name: 'doctors',
    path: '/doctors',
    component: Doctors,
  },
  {
    name: 'nurses',
    path: '/nurses',
    component: () => import('@/pages/nurses/ui/Nurses.vue'),
  },
]
