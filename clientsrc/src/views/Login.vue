<template>
  <div class="login container-fluid">
    <div class="row">
      <div class="col-12" style="margin-top: 5%;" v-if="!$auth.isAuthenticated">
        <button
          style="min-height: 50vh;
            background-image: radial-gradient(white, blue, black);"
          class="btn btn-info btn-block"
          @click="login"
        >
          <h1 class="text-dark">
            <i class="fa fa-user-circle fa-5x" aria-hidden="true"></i>
            <br />LOGIN
          </h1>
        </button>
      </div>
    </div>
  </div>
</template>


<script>
import { onAuth } from "@bcwdev/auth0-vue";
export default {
  name: "login",
  data() {
    return {};
  },
  computed: {},
  methods: {},
  components: {},
  beforeCreate() {
    if (this.$auth.isAuthenticated) {
      this.$store.dispatch("setBearer", this.$auth.bearer);
      this.$store.dispatch("getProfile");
      this.$router.push({ name: "home" });
    }
  },
};
</script>


<style scoped>
</style>