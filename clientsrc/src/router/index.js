import Vue from 'vue'
import Router from 'vue-router'
import Home from '../views/Home.vue'
import endgame from '../components/endgame.vue'
import Game from '../views/Game.vue'
import { nextTick } from "q"
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
    path: '/endgame',
    name: 'endgame',
    component: endgame
  },
  {
    path: '/game',
    name: 'game',
    component: Game,
    // beforeEnter: authGuard
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
  // if (to.name != "Home" && !isAuthenticated) {
  //   next({ name: "Home" })
  // }
  if (from.name == "game" && window.stream.class) {
    swal({
      title: "Are you sure you want to leave game...You may lose your connection to your peer!",
      icon: "warning",
      buttons: {
        one: { text: "Cancel", value: false },
        zero: { text: "Confirm", value: true },
      },
    }).then((value) => {
      if (value) {
        window.stream.class = false;
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