<template>
  <div class="question">
    <div class="row" v-if="show">{{swalShow()}}</div>
  </div>
</template>
<script>
import utils from "../assets/utils";
export default {
  name: "question",
  data: function () {
    return {
      show: false,
    };
  },
  methods: {
    swalShow: function () {
      this.$store.dispatch("getExercise");
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

<style scoped>
.swal-overlay {
  background-color: transparent;
}
.swal-modal {
  background-color: rgba(100, 100, 255, 0.69);
  border: 6px inset gold;
  color: white;
  min-width: 60%;
  min-height: 50%;
  text-align: center;
  justify-content: center;
  align-content: center;
}
.swal-footer {
  text-align: center;
}
.swal-icon img {
  max-width: 25%;
  border-radius: 5%;
  border: antiquewhite solid 2px;
  background-color: rgb(0, 0, 0);
}
</style>