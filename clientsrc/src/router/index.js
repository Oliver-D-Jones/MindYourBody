import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import endgame from '../components/endgame.vue'
import Game from '../views/Game.vue'
import { authGuard } from "@bcwdev/auth0-vue"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/endgame',
      name: 'endgame',
      component: endgame
    },
    {
      path: '/game',
      name: 'game',
      component: Game,
      //beforeEnter: authGuard
    },
    {
      path: "*",
      redirect: '/'
    }
  ]
})