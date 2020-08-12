import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import Game from '../views/Game.vue'
import GameStart from '../views/GameStart.vue'
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
      path: '/game',
      name: 'game',
      component: Game,
      beforeEnter: authGuard
    },
    {
      path: '/gameStart',
      name: 'gameStart',
      component: GameStart
    },
    {
      path: "*",
      redirect: '/'
    }
  ]
})