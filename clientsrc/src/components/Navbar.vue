<template>
  <nav
    class="navbar gameFont navbar-expand-lg mb-1 text-dark"
    style="height:10vh;max-height:12vh;border-bottom:solid 2px white; background-image: radial-gradient(white, white, black);"
  >
    <router-link class="navbar-brand" style="font-size: 2.5rem;color:blue;" :to="{ name: 'home' }">MYB</router-link>
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
          <a class="nav-link" data-toggle="modal" href="#leaderboardmodal">Leaderboard</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" data-toggle="modal" href="#aboutmodal">About</a>
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
      <div class="navbar-text" v-if="$auth.isAuthenticated" style="margin-top: auto;margin-right: 37vw;color:blue;">
        <h4 v-if="points">Total Points: {{points}}</h4>
        <h4 v-else>Total Points: 0</h4>
      </div>
      <span class="navbar-text">
        <button class="btn btn-success" @click="login" v-if="!$auth.isAuthenticated">Login</button>
        <button class="btn btn-dark text-info" @click="logout" v-else>logout</button>
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
        <div class="modal-content bg-primary leaderFont">
          <div class="modal-header">
            <h5 class="modal-title" id="leaderboardmodal"></h5>
          </div>
          <div class="modal-body">
            <b>TOP POINT EARNERS</b>
          </div>
          <h3>
            <ol>
              <leader v-for="leader in leaders" :leader="leader" :key="leader.id"></leader>
            </ol>
          </h3>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
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
            <p>Welcome to 'Mind Your Body', the total app for the whole person. Press 'start' to receive a question that tests your knowledge. When you are ready, press 'start exercise' and you will be given an routine. While you exercise, consider the answer to the question. When you finish the exercise, press 'complete' and choose the best answer to your question. A right answer earns you 5 points for an easy question, 10 points for an intermediate question, and 20 points for a difficult question. You may change the exercise before beginning. Repeat as many times as you like for a full workout of both your body and your brain.</p>
            <!-- NOTE add about -->
            <!-- <p><b>Invite & join</b></p> -->

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import Profile from "../components/profile";
import Leader from "../components/Leader";
import axios from "axios";
let _api = axios.create({
  baseURL: "https://localhost:3000",
  withCredentials: true,
});
export default {
  name: "Navbar",
  mounted() {
    this.$store.dispatch("getLeaders");
  },
  computed: {
    leaders() {
      return this.$store.state.leaders;
    },
    points() {
      return this.$store.state.currentPlayer.points;
    },
  },
  methods: {
    async login() {
      await this.$auth.loginWithPopup();
      this.$store.dispatch("setBearer", this.$auth.bearer);
      this.$store.dispatch("getProfile");
      //this.$store.dispatch("getCurrentPlayer");
      console.log("this.$auth.user: ");
      console.log(this.$auth.user);
    },
    async logout() {
      await this.$auth.logout({ returnTo: window.location.origin });
    },
  },
  components: {
    Leader,
    Profile,
  },
};
</script>

<style>
.nav-link{
  color: blue;
}
</style>