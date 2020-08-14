<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <router-link class="navbar-brand" :to="{ name: 'home' }">MYB</router-link>
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarText"
      aria-controls="navbarText"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarText">
      <ul class="navbar-nav mr-auto align-content-center">
        <li class="nav-item" :class="{ active: $route.name == 'home' }">
          <router-link :to="{ name: 'home' }" class="nav-link">Home</router-link>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-toggle="modal" href="#leaderboardmodal">Leaderboard</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-toggle="modal" href="#aboutmodal">About</a>
        </li>
        <li
          class="nav-item ml-3 mr-3"
          v-if="$route.path != '/'"
          :class="{ active: $route.name == 'home' }"
        >
          <router-link :to="{ name: 'home' }" class="nav-link">Quit</router-link>
        </li>
      </ul>
      <span class="navbar-text">
        <button class="btn btn-success" @click="login" v-if="!$auth.isAuthenticated">Login</button>
        <button class="btn btn-danger" @click="logout" v-else>logout</button>
      </span>
    </div>
    <!--leadermodal-->
    <div
      class="modal fade"
      id="leaderboardmodal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLongTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="leaderboardmodal">Leader Board</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">TOP SCORES</div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary">Save changes</button>
          </div>
        </div>
      </div>
    </div>
    <div
      class="modal fade"
      id="aboutmodal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalLongTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="aboutmodal">Directions</h5>
          </div>
          <div class="modal-body text-justify">
            <p>Welcome to 'Mind Your Body', the total app for the whole person. Press 'start' to receive a question that tests your knowledge. When you are ready, press 'start activity' and you will be given an exercise. While you exercise, consider the answer to the question. When you finish the exercise, press 'complete' and choose the best answer to your question. A right answer earns you 5 points for an easy question, 10 points for an intermediate question, and 20 points for a difficult question. You may change the exercise before beginning. Repeat as many times as you like for a full workout of both your body and your brain.</p>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import axios from "axios";

let _api = axios.create({
  baseURL: "https://localhost:3000",
  withCredentials: true,
});
export default {
  name: "Navbar",
  mounted() {
    //this.$store.dispatch("getQuestion");
  },
  computed: {
    /*question() {
      return this.$store.state.question;
    },*/
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
};
</script>

<style></style>
