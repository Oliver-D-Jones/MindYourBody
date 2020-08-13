<template>
  <div>
    <h1>End of Round</h1>
    <h3 v-if="answer">You just earned {{points}} points!</h3>
    <h3 v-else>No points this round.</h3>
  </div>
</template>

<script>
export default {
  name: "answer",
  data: function () {
    let answers = this.$store.state.trivia.incorrect_answers;
    let correct_answer = this.$store.state.trivia.correct_answer;
    swal(this.$store.state.trivia.question, {
      className: "red-bg",
      closeOnClickOutside: false,
      buttons: {
        zero: {
          text: answers[0],
          value: answers[0],
        },
        two: {
          text: answers[1],
          value: answers[1],
        },
        three: {
          text: answers[2],
          value: answers[2],
        },
        four: {
          text: answers[3],
          value: answers[3],
        },
      },
    }).then((value) => {
      if (value == correct_answer) {
        swal(`${correct_answer}`, "Is Correct!", "success").then(() => {
          swal.close();
          this.$emit("init", true);
        });
      } else {
        swal("Incorrect.", "Try Again.", "error").then(() => {
          swal.close();
          this.$emit("init", true);
        });
      }

      this.show = false;
    });
    return {};
    //trigger next to display 'Next Round' Modal component
  },
  mounted() {
    this.$store.dispatch("getAnswer");
    this.$store.dispatch("getTrivia");
  },

  computed: {
    answer() {
      return this.$store.state.answer;
    },
    points() {
      let pts = 0;
      let level = this.$store.state.trivia.difficulty;
      if (level == "easy") {
        pts = 5;
      } else if (level == "medium") {
        pts = 10;
      } else {
        pts = 20;
      }
      return pts;
    },
  },
  methods: {},
  components: {},
};
</script>


<style scoped></style>
 swal({
        title: "Question",
        text: this.trivia.question,
        className: "red-bg",
        closeOnClickOutside: false,
        buttons: {
          zero: { text: "Start Exercise", value: true },
          two: { text: "Quit Game", value: false },
        },
      }).then((value) => {
        if (value) {
          // display close and display excercize
          this.excercizeCall = true;
          this.answer = true;
        } else {
          this.$router.push({ name: "home" });
        }
      });
      this.start = false;
    },