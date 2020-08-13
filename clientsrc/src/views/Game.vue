<template>
  <div class="game">
    <div class="container-fluid">
      <div class="row" style="display:none;">
        <div class="col-12" v-if="start">
          <div>{{getTrivia()}}</div>
        </div>
        <div class="col-12" v-if="answer">
          <Answer :key="trivia.correct_answer" v-on:init="start = $event" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Excercize from "../components/exercise";
import Answer from "../components/answer";
export default {
  name: "game",
  data() {
    return {
      trivia: null,
      start: false,
      answer: false,
      excercize: false,
    };
  },
  computed: {},
  methods: {
    init(play) {
      console.log("in start at game");
      if (play) {
        this.start = true;
      } else {
        this.start = false;
      }
    },
    //Get trivia data from api call and store
    async getTrivia() {
      //NOTE get personal pref. from store.state
      this.start = false;
      let cat = 19;
      let answers = [];
      const res = await fetch(
        `https://opentdb.com/api.php?amount=1&category=${cat}&type=multiple&encode=base64`
      );
      let data = await res.json();
      data = data.results[0];
      for (let property in data) {
        if (Array.isArray(data[property])) {
          data[property].forEach((prop, i, a) => {
            a[i] = atob(prop);
          });
        } else {
          data[property] = atob(data[property]);
        }
      }
      this.$store.commit("setTrivia", data);
      this.trivia = data;
      answers = data.incorrect_answers;
      answers.push(data.correct_answer);
      answers.forEach((v, i, a) => {
        let swap_index = Math.floor(a.length * Math.random());
        let temp = a[swap_index];
        a[swap_index] = v;
        a[i] = temp;
      });
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
  },
  mounted() {
    this.start = true;
  },
  components: {
    Excercize,
    Answer,
  },
};
</script>


<style>
.swal-modal {
  background-color: rgba(63, 255, 106, 0.69);
  border: 3px solid white;
  min-width: 60%;
  text-align: center;
  justify-content: center;
  align-content: center;
}
.swal-footer {
  text-align: center;
}
.search:hover {
  color: blue;
  background-color: antiquewhite;
}
</style>
