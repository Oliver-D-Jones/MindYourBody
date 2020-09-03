<template>
  <div class="question" v-if="show">
    <div class="row">{{swalShow()}}</div>
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
      let html_inject = document.createElement("div");
      html_inject.className = "col-12";
      let cat = document.createElement("p");
      cat.innerHTML = `<i class="fa fa-tags" aria-hidden="true"></i> &nbsp;${this.$store.state.trivia.category}<br/><br/><i class="fa fa-arrows-v" aria-hidden="true"></i> &nbsp;${this.$store.state.trivia.difficulty}`;
      html_inject.appendChild(cat);
      let title = document.createElement("h4");
      title.innerHTML = `${this.$store.state.trivia.question}`;
      html_inject.appendChild(title);
      let img = utils.getGif();
      let btns;
      btns = {
        quit: { text: "Quit Game", value: false },
        startEx: { text: "Start Exercise", value: true },
      };
      swal({
        content: html_inject,
        className: "red-bg",
        icon: img,
        closeOnClickOutside: false,
        buttons: btns,
      }).then((value) => {
        if (value) {
          if (window.stream.class) {
            stream.sendMessage("Your Friend Started Their Exercise.");
          }
          this.show = false;
          this.$emit("workout", true);
          swal.close();
        } else {
          if (window.stream.class) {
            stream.sendMessage("Your Friend Quit On You.");
          }
          this.$emit("init", false);
          this.show = false;
          swal.close();
          this.$router.push({ name: "home" });
        }
      });
    },
  },
  beforeDestroy() {
    swal.close();
  },
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
  max-width: 20rem;
  border-radius: 5%;
  border: antiquewhite solid 2px;
  background-color: rgb(0, 0, 0);
}
</style>