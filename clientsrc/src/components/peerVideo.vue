<template>
  <div class="peerVideo mt-0">
    <h4 class="mt-0">
      <span
        id="peerName"
        class="badge badge-primary text-truncate my-0"
        style="width: -webkit-fill-available;">
      </span>
    </h4>
    <div class="my-0">
      <video
        autoplay="true"
        id="peerVideo"
        class="col-12"
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
};
</script>


<style scoped>
</style>