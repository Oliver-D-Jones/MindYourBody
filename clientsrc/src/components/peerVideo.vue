<template>
  <div class="peerVideo bg-info">
    <h3 class="mb-0">
      <span
        id="peerName"
        class="badge badge-dark text-truncate my-0"
        style="width: -webkit-fill-available;"
      ></span>
    </h3>
    <div class="mt-0">
      <video
        autoplay="true"
        id="peerVideo"
        class="col-12 mt-0"
        poster="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.giphy.com%2Fmedia%2Fi3pHUtmHiLd28%2Fgiphy.gif&f=1&nofb=1"
        controls
      ></video>
    </div>
  </div>
</template>


<script>
export default {
  name: "peerVideo",
  data() {
    return {};
  },
  computed: {},
  methods: {},
  components: {},
  beforeDestroy() {

  },
};
</script>


<style scoped>
</style>