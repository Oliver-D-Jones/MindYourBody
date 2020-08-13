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
      let q = this.question;
      console.log("swalShow");
      swal({
        title: "Question",
        text: q,
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
      console.log("question");
  },
};
</script>


<style scoped>
</style>