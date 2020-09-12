import Vue from 'vue'
import Router from 'vue-router'
// @ts-ignore
import Home from '../views/Home.vue'
// @ts-ignore
import endgame from '../components/endgame.vue'
// @ts-ignore
import Game from '../views/Game.vue'
// @ts-ignore
import Login from '../views/Login.vue'
import { authGuard } from "@bcwdev/auth0-vue"
import swal from "sweetalert"

Vue.use(Router)


const routes = [

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
    path: '/players/:id',
    name: 'players',
    component: endgame,
  },
  {
    path: "/game/:id/inviter",
    name: "inviter",
    component: Game,
    beforeEnter: authGuard,
  },
  {
    path: "/game/:id/invitee",
    name: "invitee",
    component: Game,
    beforeEnter: authGuard,

  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "*",
    redirect: '/'
  }
]
const router = new Router({
  routes
})

export default router

// for all routes
router.beforeEach((to, from, next) => {
  // if (to.name != "home") {
  //   next({ name: "home" })
  // }
  if ((from.name == "invitee" || from.name == "inviter")) {
    swal({
      title: "Are you sure you want to leave Game...You may lose your connection to your peer!",
      icon: "warning",
      buttons: {
        one: { text: "Cancel", value: false },
        zero: { text: "Confirm", value: true },
      },
    }).then((value) => {
      if (value) {
        swal.close();
        next();
      } else {
        next(false)
        swal.close();
      }
    });
  } else {
    next()
  }
})