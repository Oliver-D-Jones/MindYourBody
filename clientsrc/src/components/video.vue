<template>
  <div class="video">
    <div id="container">
      <div class="row">
        <div class="col-6">
          <video autoplay="true" id="videoElement"></video>
          <br />
          <button @click="play">Play</button>
          <button @click="pause">Pause</button>
          <button @click="stop">Stop</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "video",
  data() {
    return {
        video:null,
    };
  },
  computed: {},
  methods: {
    play() {
      console.log("play");
      disableButtons(true, false, false);
      video.play();
    },

    pause() {
      disableButtons(false, true, false);
      video.pause();
    },

    stop() {
      video.pause();
      video.src = "";
    },
  },
  components: {},
  mounted() {
    this.video = document.querySelector("#videoElement");

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (stream) {
          video.srcObject = stream;
        })
        .catch(function (err0r) {
          console.log("Something went wrong!");
        });
    }
  },
};
</script>


<style scoped>
</style>