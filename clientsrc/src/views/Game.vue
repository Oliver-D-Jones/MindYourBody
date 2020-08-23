<template>
  <div class="game">
    <div class="container-fluid" id="main" style="min-height:100vh;">
      <div class="row" style="display: flex;justify-content: space-around;">
        <div class="col-2" v-if="invitee">
          <Invitee
            key="inviteeVideostream"
            v-on:inviteeWorkoutComplete="()=>{
              inviteeAct = true;
          }"
            v-on:inviteeWorkout="()=>{
            showQuestion = false;
            exercise = true;
          }"
            v-on:inviteeStart="()=>{
              start = false;
              showQuestion=true;
            }"
          />
        </div>

        <div
          class="col-2"
          v-if="inviter"
          v-on:inviterStart="()=>{
              showQuestion=true;
              start = false;
            }"
        >
          <Inviter key="inviterVideostream" />
        </div>
        <div :class="display" v-if="exercise">
          <Exercise key="workout" v-on:workoutcomplete="workoutcomplete()" />
        </div>

        <div :class="display" v-if="end">
          <Endgame v-on:init="init()" key="endgame" />
        </div>

        <div v-if="start" style="display:none;max-width:0px">{{begin()}}</div>

        <div :class="display" v-if="showQuestion">
          <Question v-on:workout="workout()" key="question" />
        </div>
      </div>
      <div :class="display" v-if="answer">
        <Answer key="answer" v-on:endgame="endgame()" :inviteeAct="inviteeAct" />
      </div>
    </div>
  </div>
</template>

<script>
import Exercise from "../components/exercise";
import Answer from "../components/answer";
import Question from "../components/question";
import Endgame from "../components/endgame";
import Inviter from "../components/inviter";
import Invitee from "../components/invitee";

export default {
  name: "game",
  data() {
    return {
      test: null,
      start: false,
      answer: false,
      exercise: false,
      end: false,
      showQuestion: false,
      inviter: false,
      invitee: false,
      inviteeAct:false,
    };
  },
  computed: {},
  methods: {
    // inviteeStart(go) {
    //   console.log("emit inviteeStart");
    //   this.showQuestion = true;
    // },
    // inviterStart(go) {
    //   console.log("emit inviterStart?????????????????????????????????????????");
    //   this.showQuestion = true;
    //   this.start = false;
    // },
    workoutcomplete(complete) {
      this.exercise = false;
      this.answer = true;
    },
    workout(work) {
      this.start = false;
      this.exercise = true;
    },
    init(play) {
      this.start = true;
      this.end = false;
      this.showQuestion = false;
      this.exercise = false;
    },
    endgame(correct) {
      this.answer = false;
      this.end = true;
    },
    async begin() {
      this.$store.dispatch("getExercise");
      let cat = this.$store.state.subject;
      let level = this.$store.state.level;
      let answers = [];
      let token = window.stream.triviaToken;
      const res = await fetch(
        `https://opentdb.com/api.php?amount=1&category=${cat}&difficulty=${level}&type=multiple&token=${token}`
      );
      let data = await res.json();
      data = data.results[0];
      for (let property in data) {
        if (Array.isArray(data[property])) {
          data[property].forEach((prop, i, a) => {
            a[i] = prop;
          });
        } else {
          data[property] = data[property];
        }
      }
      answers = data.incorrect_answers;
      answers.push(data.correct_answer);
      answers.forEach((v, i, a) => {
        let swap_index = Math.floor(a.length * Math.random());
        let temp = a[swap_index];
        a[swap_index] = v;
        a[i] = temp;
      });
      data.incorrect_answers = answers;
      this.$store.commit("setTrivia", data);
      // if (!stream.class) {
      //   }
      this.showQuestion = true;
      this.start = false;
    },
  },
  beforeMount() {
    console.log(window.stream.class);
    if (window.stream.class == "inviter") {
      this.start = true;
      this.inviter = true;
      this.display = "col-sm-12 col-md-10";
    } else if (window.stream.class == "invitee") {
      this.invitee = true;
      this.display = "col-sm-12 col-md-10";
    } else {
      this.display = "col-12";
      this.start = true;
    }
  },
  beforeDestroy() {
    // if (swal.isVisible()) {
    //   swal.close();
    // }
    // window.stream.localStream.stop();
  },
  components: {
    Exercise,
    Answer,
    Question,
    Endgame,
    Inviter,
    Invitee,
  },
};
</script>
<style>
video {
  min-width: 200px !important;
  max-width: 200px !important;
  min-height: 150px !important;
  max-height: 150px !important;
  border: solid 2px blue;
  box-shadow: 2px 3px 8px white;
  border-radius: 8%;
}
#main {
  background-image: url("../assets/end.jpg");
}
</style>
