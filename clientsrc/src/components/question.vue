<template>
  <div class="question">
    <div class="row" v-if="show">{{swalShow()}}</div>
  </div>
</template>
<script>
import utils from "../assets/utils"
export default {
  name: "question",
  data: function () {
    return {
      show: false,
    };
  },
  methods: {
    swalShow: function () {
      let html_inject = document.createElement("div");
      html_inject.className = "col-12";
      let title = document.createElement("h4");
      title.innerHTML = `${this.question}`;
      html_inject.appendChild(title);
      let img = utils.getGif();
      swal({
        content: html_inject,
        className: "red-bg",
        icon: img,
        closeOnClickOutside: false,
        buttons: {
          zero: { text: "Start Exercise", value: true },
          two: { text: "Quit Game", value: false },
        },
      }).then((value) => {
        if (value) {
          this.$emit("workout", true);
          this.show = false;
          swal.close();
        } else {
          this.$emit("init", false);
          this.show = false;
          swal.close();
          this.$router.push({ name: "home" });
        }
      });
    },
  },
  props: ["question"],
  mounted() {
    this.show = true;
  },
};
</script>
<style>
.swal-icon {
  max-width: 16%;
  border-radius: 10%;
  border: aliceblue 2px inset;
  background-color: black;
}
</style>