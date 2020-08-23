<template>
  <div class="answer">
    <div class="row" v-if="show">
      <div>{{data()}}</div>
    </div>
  </div>
</template>
<script>
import utils from "../assets/utils";
export default {
  name: "answer",
  data: function () {
    let answers = this.$store.state.trivia.incorrect_answers;
    let correct_answer = this.$store.state.trivia.correct_answer;
    let html_inject = document.createElement("div");
    let qIcon = utils.getGif();
    html_inject.className = "col-12";
    let title = document.createElement("h4");
    title.innerHTML = `${this.$store.state.trivia.question}`;
    html_inject.appendChild(title);

    swal({
      content: html_inject,
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
        swal(`${correct_answer} Is Correct!`, "", "success").then(() => {
          this.$emit("endgame", true);
          this.$store.state.answer = true;
          swal.close();
        });
      } else {
        let html_inject = document.createElement("div");
        html_inject.className = "col-12";
        let title = document.createElement("h4");
        title.innerHTML = `${correct_answer},<br/>is the correct answer!`;
        html_inject.appendChild(title);
        swal({
          content: html_inject,
          icon:"//external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.giphy.com%2Fmedia%2F3oKIPhgolxVfDklIqc%2Fgiphy.gif&f=1&nofb=1",
          className: "wrong",
          closeOnClickOutside: false,
        }).then(() => {
          this.$emit("endgame", true);
          this.$store.state.answer = false;
          swal.close();
        });
      }
      this.show = false;
    });
    return {
      date: Date.now(),
      playerid: this.$store.state.currentPlayer.profileId,
    };
  },
  mounted() {
    this.show = true;
    this.$store.dispatch("getCurrentPlayer");
    this.$store.dispatch("setDates", {
      date: this.date,
      id: this.playerid,
    });
  },
};
</script>


<style scoped>
</style>