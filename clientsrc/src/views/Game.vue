<template>
  <div class="game">
    <div class="container-fluid">
      <div class="row" style="display:none;">
        <div class="col-12" v-if="start">
          <Question
            :question="trivia.question"
            v-on:workout="exercise = $event"
            :key="trivia.question"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-12" v-if="exercise">
          <Exercise :key="'workout'" v-on:workoutcomplete="answer = $event" />
        </div>
      </div>

      <div class="row">
        <div class="col-12" v-if="answer">
          <Answer :key="trivia.correct_answer" v-on:init="start = $event" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Exercise from "../components/exercise";
import Answer from "../components/answer";
import Question from "../components/question";
export default {
  name: "game",
  data() {
    return {
      trivia: null,
      start: false,
      answer: false,
      exercise: false,
    };
  },
  computed: {},
  methods: {
    workoutcomplete(complete) {
      if (complete) {
        this.answer = true;
      } else {
        this.answer = false;
      }
    },
    workout(work) {
      if (work) {
        this.exercise = true;
      } else {
        this.exercise = false;
      }
    },
    init(play) {
      console.log("in start at game");
      if (play) {
        this.start = true;
      } else {
        this.start = false;
      }
    },
  },
  async mounted() {
    //Get trivia data from api call and store
    //NOTE get personal pref. from store.state
    console.log("in mounted");
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
    this.question = data.question;
    this.trivia = data;
    console.log(this.trivia);
    answers = data.incorrect_answers;
    answers.push(data.correct_answer);
    answers.forEach((v, i, a) => {
      let swap_index = Math.floor(a.length * Math.random());
      let temp = a[swap_index];
      a[swap_index] = v;
      a[i] = temp;
    });
    this.start = true;
  },
  components: {
    Exercise,
    Answer,
    Question,
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
