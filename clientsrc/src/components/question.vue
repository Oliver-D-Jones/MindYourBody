<template>
  <div class="question">
    <div class="row" v-if="show">{{swalShow()}}</div>
  </div>
</template>
<script>
export default {
  name: "question",
  data: function () {
    return {
      show: false,
    };
  },
  computed: {},
  methods: {
    swalShow: function () {
      let html_inject = document.createElement("div");
      html_inject.className = "col-12";

      let img = document.createElement("img");
      img.className = "img-fluid img-sm";
      img.src = "https://media.giphy.com/media/LJH5l2g4cOEjm/giphy.gif"
      img.id = "brain";

      let title = document.createElement("h4");
      title.textContent=`${this.question}`
      html_inject.appendChild(img);
      html_inject.appendChild(title);
      swal({
        content: html_inject,
        className: "red-bg",
        closeOnClickOutside: false,
        buttons: {
          zero: { text: "Start Exercise", value: true },
          two: { text: "Quit Game", value: false },
        },
      }).then((value) => {
        if (value) {
          // display close and display excercise
          this.$emit("workout", true);
          this.show = false;
        } else {
          this.$emit("init", false);
          this.show = false;
          this.$router.push({ name: "home" });
        }
      });
    },
  },
  components: {},
  props: ["question"],
  mounted() {
    this.show = true;
  },
};
</script>


<style scoped>
#brain {
border-radius: 50%
}
</style>