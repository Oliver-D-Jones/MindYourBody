<template>
  <div class="game">
    <div class="container-fluid" id="main" style="min-height:100vh;">
      <div class="row" style="display: flex;justify-content: space-around;">
        <div class="col-md-4 mt-1" v-if="invitee">
          <button
            v-if="displayStart && $auth.isAuthenticated"
            class="btn btn-info btn-block mb-1"
            @click="startGame"
          >START</button>
          <Invitee
            key="inviteeVideostream"
            v-on:inviteeWorkoutComplete="()=>{
          }"
            v-on:inviteeWorkout="()=>{
            showQuestion = false;
            exercise = true;
          }"
            v-on:init="init()"
          />
        </div>
        <div class="col-12" style="margin-top: 5%;" v-if="!$auth.isAuthenticated">
          <button
            style="min-height: 50vh;
            background-image: radial-gradient(white, blue, black);"
            class="btn btn-info btn-block"
            @click="login"
          >
            <h1 class="text-dark">
              <i class="fa fa-user-circle fa-5x" aria-hidden="true"></i>
              <br />LOGIN
            </h1>
          </button>
        </div>

        <div class="col-md-4 mt-1" v-if="inviter">
          <button v-if="displayStart" class="btn btn-info btn-block mb-1" @click="startGame">START</button>
          <Inviter
            :key="'inviterVideostream'"
            v-on:inviteeReady="()=>{
            displayStart=true;
          }"
          />
        </div>

        <div :class="display" v-if="showQuestion">
          <Question v-on:workout="workout()" key="question" />
        </div>

        <div :class="display" v-if="exercise">
          <Exercise key="workout" v-on:workoutcomplete="workoutcomplete()" />
        </div>

        <div :class="display" v-if="answer">
          <Answer key="answer" v-on:endgame="endgame()" />
        </div>

        <div :class="display" v-if="end">
          <Endgame v-on:init="init()" key="endgame" />
        </div>
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
import router from "../router";

export default {
  name: "game",
  data() {
    return {
      answer: false,
      exercise: false,
      end: false,
      showQuestion: false,
      inviter: false,
      invitee: false,
      displayStart: false,
    };
  },
  computed: {},
  methods: {
    async login() {
      await this.$auth.loginWithPopup().then(() => {
        this.$store.dispatch("setBearer", this.$auth.bearer);
        this.$store.dispatch("getProfile");
      });
    },
    startGame() {
      this.showQuestion = true;
      window.sessionStorage.sequence = "showQuestion";
      this.displayStart = false;
    },
    workoutcomplete(complete) {
      this.exercise = false;
      window.sessionStorage.sequence = "answer";

      this.answer = true;
    },
    workout(work) {
      this.showQuestion = false;
      window.sessionStorage.sequence = "exercise";

      this.exercise = true;
    },
    endgame(correct) {
      this.answer = false;
      window.sessionStorage.sequence = "end";
      this.end = true;
    },
    async init(play) {
      this.end = false;
      this.showQuestion = false;
      this.exercise = false;
      if (!window.stream.class) {
        this.begin();
      } else if (window.stream.class == "invitee") {
        setTimeout((event) => {
          window.stream.connection.send({ class: "inviteeReady" }), 1200;
        });
        this.displayStart = true;
      } else if (window.stream.class == "inviter") {
        await this.begin();
      }
    },
    async begin() {
      await this.$store.dispatch("getExercise");
      let cat = this.$store.state.subject;
      let level = this.$store.state.level;
      let answers = [];
      let token = this.$store.state.triviaToken;
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
      window.sessionStorage.trivia = JSON.stringify(data);
      if (!stream.class) {
        this.showQuestion = true;
        sessionStorage.sequence = "showQuestion";
      } else if (window.stream.connection.open) {
        let dataToSend = {
          class: "replay",
          trivia: this.$store.state.trivia,
          exercise: this.$store.state.exercise,
        };
        window.stream.connection.send(dataToSend);
      }
    },
  },
  beforeCreate() {
    console.log("IN BC");
  },
  async beforeMount() {
    console.log("IN BM");
    if (window.sessionStorage.sequence) {
      eval(`this.${sessionStorage.sequence} = true`);
    }
    let loc = window.location.href.split("/");
    let player = loc[loc.length - 1];

    if (player == "invitee") {
      if (this.$auth.isAuthenticated) {
        window.stream = new Object();
        window.stream.class = "invitee";
        window.stream.peerId = loc[loc.length - 2];
        let myId = (Math.random().toString(36) + "0000000000000000000").substr(
          2,
          16
        );
        window.stream.myId = myId;
        this.display = "col-md-8";
        this.invitee = true;
        this.displayStart = true;
      }
    } else if (player == "inviter") {
      this.inviter = true;
      this.begin();
      this.display = "col-md-8";
    } else {
      sessionStorage.class = false;
      this.display = "col-12";
      this.begin();
    }
  },
  beforeDestroy() {},
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
  padding-top: 1rem;
  margin-bottom: 0px;
}
@media screen and (max-width: 425px) {
  video {
    height: 30vh;
  }
}
.controls {
  margin-top: 0px;
  padding-bottom: 0.5rem;
}
.controls svg:hover {
  fill: white;
}
.video-container {
  border: solid 2px white;
  background-color: rgb(0, 0, 0);
}
#main {
  background-image: url("../assets/end.jpg");
  background-position: center;
}
#msgAll {
  height: 30vh;
  min-width: -webkit-fill-available;
  padding: 4px;
  border: 1px solid white;
  position: absolute;
  text-align: center;
  left: 0px;
  z-index: 1000;
}
</style>
