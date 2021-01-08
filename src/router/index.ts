import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import New from '../Views/New.vue';
import Edit from '../Views/Edit.vue';

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/statistik',
    name: 'Statistik',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../Views/Statistik.vue')
  },
  {
    path: '/edit/:key',
    name: 'Edit',
    component: Edit,
  },
  {
    path: '/',
    name: 'New',
    component: New
  },
]

const router = new VueRouter({
  routes
})

export default router
