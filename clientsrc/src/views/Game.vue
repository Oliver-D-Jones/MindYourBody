<template>
  <div class="game">
    <div class="container-fluid bg-info" style="min-height:99vh">
      
      <div v-if="inviter">
        <Inviter :key="'videostream'" />
      </div>

      <div class="row">
        <div class="col-md-2" v-if="invitee">
          <Invitee :key="'videostream'" />
        </div>
      </div>

      <div class="row">
        <div class="col-12" v-if="exercise">
          <Exercise :key="'workout'" v-on:workoutcomplete="workoutcomplete()" />
        </div>
      </div>
      <div class="row">
        <div class="col-12" v-if="end">
          <Endgame v-on:init="init()" />
        </div>
      </div>
      <div class="row">
        <div class="col-12" v-if="start" style="display:none">{{begin()}}</div>

        <Question
          :question="trivia.question"
          v-on:workout="workout()"
          :key="trivia.question"
          v-if="getQuestion"
        />
      </div>
    </div>
    <div class="row" style="display:none;">
      <div class="col-12" v-if="answer">
        <Answer :key="trivia.correct_answer" v-on:endgame="endgame()" />
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
      trivia: null,
      start: false,
      answer: false,
      exercise: false,
      end: false,
      getQuestion: false,
      inviter: false,
      invitee: false,
    };
  },
  computed: {},
  methods: {
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
      this.getQuestion = false;
      this.exercise = false;
    },
    endgame(correct) {
      this.answer = false;
      this.end = true;
    },
    async begin() {
      //Get trivia data from api call and store
      //NOTE get personal pref. from store.state
      console.log("in Begin of game");
      let cat = this.$store.state.subject;
      let level = this.$store.state.level;
      let answers = [];
      const res = await fetch(
        `https://opentdb.com/api.php?amount=1&category=${cat}&difficulty=${level}&type=multiple`
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
      this.$store.commit("setTrivia", data);
      this.question = data.question;
      this.trivia = data;
      answers = data.incorrect_answers;
      answers.push(data.correct_answer);
      answers.forEach((v, i, a) => {
        let swap_index = Math.floor(a.length * Math.random());
        let temp = a[swap_index];
        a[swap_index] = v;
        a[i] = temp;
      });
      this.getQuestion = true;
      this.start = false;
    },
  },
  beforeMount() {
    console.log(this.$store.state.stream.class);
    if (this.$store.state.stream.class == "inviter") {
      console.log("in inviter");
      this.invitee = false;
      this.inviter = true;
    } else if (this.$store.state.stream.class == "invitee") {
      console.log("in invitee");
      this.inviter = false;
      this.invitee = true;
    }
    this.start = true;
  },
  beforeDestroy() {
    if (swal.isVisible()) {
      swal.close();
    }
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


<style scoped>
</style>
