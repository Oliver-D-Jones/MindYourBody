<template>
  <nav
    class="navbar gameFont navbar-expand-lg mb-1 text-dark font-weight-bold"
    style="border-bottom:solid 2px white; background-image: radial-gradient(white, gray, black);"
  >
    <router-link
      class="navbar-brand"
      style="font-size: 2.5rem; color:rgb(0, 0, 206);"
      :to="{ name: 'home' }"
    >MYB</router-link>
    <button
      class="navbar-toggler btn btn-outline-info pb-1"
      type="button"
      data-toggle="collapse"
      data-target="#navbarText"
      aria-controls="navbarText"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span>
        <i class="fa fa-bars fa-2x" aria-hidden="true"></i>
      </span>
    </button>
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav mr-auto align-content-center">
        <li class="nav-item" :class="{ active: $route.name == 'home' }">
          <router-link :to="{ name: 'home' }" class="nav-link">Home</router-link>
        </li>
        <li class="nav-item">
          <Leader />
        </li>
        <li class="nav-item">
          <about />
        </li>
        <li class="nav-item">
          <Profile v-if="$auth.isAuthenticated" />
        </li>
        <li
          class="nav-item mr-3"
          v-if="$route.path != '/'"
          :class="{ active: $route.name == 'home' }"
        >
          <router-link :to="{ name: 'home' }" class="nav-link">Quit</router-link>
        </li>
      </ul>
      <div v-if="$auth.isAuthenticated" style="margin-top: auto;margin-right: 37vw;color:blue;">
        <h4 v-if="points">
          Total Points:
          <span class="text-success">{{points}}</span>
        </h4>
        <h4 v-else>Total Points: 0</h4>
      </div>
      <span class="navbar-text">
        <button class="btn btn-success" ontouchstart="login" @click="login" v-if="!$auth.isAuthenticated">Login</button>
        <button class="btn btn-dark text-info" ontouchstart="logout" @click="logout" v-else>logout</button>
      </span>
    </div>
  </nav>
</template>
<script>
import about from "../components/about";
import Leader from "../components/Leader";
import Profile from "../components/profile";
import axios from "axios";
let _api = axios.create({
  baseURL: "https://localhost:3000",
  withCredentials: true,
});
export default {
  name: "Navbar",
  data() {
    return {
      player: this.$store.state.currentPlayer,
    };
  },
  mounted() {
    this.$store.dispatch("getLeaders");
  },
  computed: {
    points() {
      return this.$store.state.currentPlayer.points;
    },
  },
  methods: {
    async login() {
      await this.$auth.loginWithPopup();
      this.$store.dispatch("setBearer", this.$auth.bearer);
      this.$store.dispatch("getProfile");
      console.log("this.$auth.user: ");
      console.log(this.$auth.user);
    },

    async logout() {
      await this.$auth.logout({ returnTo: window.location.origin });
    },
  },
  components: {
    about,
    Leader,
    Profile,
  },
};
</script>
<style>
.nav-link {
  color: rgb(0, 0, 206);
}
</style>