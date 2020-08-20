<template>
  <div id="app" style="background-color:black;min-height:100vh">
    <navbar />
    <router-view />
  </div>
</template>

<script>
import Navbar from "./components/Navbar";
import { onAuth } from "@bcwdev/auth0-vue";
import swal from "sweetalert";
import Peer from "peerjs";
export default {
  name: "App",

  async beforeCreate() {
    window.stream = new Object();
    window.stream.class = false;
    try {
      await onAuth();
      this.$store.dispatch("setBearer", this.$auth.bearer);
      this.$store.dispatch("getProfile");
    } catch (err) {
      this.$router.push({ name: "home" });
    }
  },
  components: {
    Navbar,
  },
  methods: {},
};
</script>


<style lang="scss">
@import "./assets/_variables.scss";
@import "bootstrap";
@import "./assets/_overrides.scss";

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
