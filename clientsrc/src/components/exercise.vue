<template>
  <div class="exercise mt-2">
    <div class="card exercise_main" style="border:solid 1px silver;" v-if="show">
      <h6 class="py-1 my-1 text-info bg-dark" style="font-size:x-large">
        <i class="fa fa-question-circle" aria-hidden="true"></i> &nbsp;
        <span id="question" class="" ></span>
      </h6>
      <transition name="bounce">
        <div v-if="imgExer">
          <img
            class="card-img-top mt-1"
            :src="exercise.example"
            alt="Exercise Example"
            style="max-width: 100%; max-height:350px; width: auto; height: auto"
          />
        </div>
      </transition>
      <div class="card-body">
        <h2 class="card-title">{{exercise.title}}</h2>
      </div>
      <ul class="list-group list-item bg-dark text-light">
        <li class="list-group-item" v-if="exercise.reps">
          <b>Repetitions:</b>
          {{exercise.reps}}
        </li>
        <li class="list-group-item" v-if="exercise.time">
          <b>Time:</b>
          {{exercise.time}} seconds
          <button
            class="btn btn-block btn-outline-warning"
            v-if="exercise.time"
            :disabled="exerciseTimerDisabled"
            @click="exerciseTimer(), exerciseTimerDisabled = true"
          >Start Timer</button>
        </li>
        <li class="list-group-item" v-if="exercise.notes">
          <b>Instructions:</b>
          {{exercise.notes}}
        </li>
      </ul>
      <div class="card-body">
        <button
          class="btn btn-block btn-outline-info"
          @click="getExercise"
          v-if="allowGet"
        >Get a Different Exercise</button>
        <button
          class="btn btn-block btn-outline-success"
          @click="workOutComplete"
          :disabled="isDisabled"
        >Finished!</button>
        <span v-if="cheatTimer">Cheat Guard: {{cheatTimer}}</span>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "exercise",
  data: function () {
    return {
      allowGet: true,
      cheatTimer: 1,
      show: false,
      isDisabled: true,
      exerciseTimerDisabled: false,
      exerciseInterval: null,
      display: "",
      imgExer: false,
    };
  },
  beforeDestroy() {
    this.$store.state.exercise = {};
  },
  beforeMount() {
    if (window.stream.class == "invitee") {
      this.allowGet = false;
    }
    this.show = true;
  },
  mounted() {

    document.getElementById(
      "question"
    ).innerHTML = this.$store.state.trivia.question;
    console.log("IN MOUNTED");
    this.cheatInterval();
  },
  computed: {
    exercise() {
      this.imgExer = true;
      if (window.stream.class == "inviter") {
        let dataToSend = {
          class: "game",
          trivia: this.$store.state.trivia,
          exercise: this.$store.state.exercise,
        };
        window.stream.connection.send(dataToSend);
      }
      return this.$store.state.exercise;
    },
  },
  methods: {
    getExercise() {
      this.imgExer = false;
      if (window.stream.class == "inviter") {
        window.stream.connection.send({
          class: "message",
          message: "Peer is fetched a new exercise.",
        });
        window.stream.connection.send({ class: "getNewExercise" });
      }

      this.$store.dispatch("getExercise");
      //NOTE ADD METHOD TO SEND NEW EXERCISE
      clearInterval(this.exerciseInterval);
      this.exerciseTimerDisabled = false;

      // NOTE enable code below to restart Cheat Gaurd when getting new exercise
      this.isDisabled = true;
      if (this.cheatTimer === 0) {
        this.cheatTimer = 15;
        this.cheatInterval();
      } else {
        this.cheatTimer = 15;
      }
    },
    workOutComplete() {
      // if (window.stream.class == "inviter") {
      //   window.stream.connection.send("workoutComplete");
      // }
      window.stream.connection.send({
        class: "message",
        message: "Peer has finished their exercise...",
      });

      this.imgExer = false;
      setTimeout(() => {
        this.show = false;
        this.$emit("workoutcomplete", true);
      }, 600);
    },

    cheatInterval() {
      let timesUp = setInterval((interval) => {
        this.cheatTimer--;
        if (this.cheatTimer === 0) {
          clearInterval(timesUp);
          this.isDisabled = false;
        }
      }, 1000);
    },

    exerciseTimer() {
      let exerciseCountDown = setInterval((interval) => {
        this.exercise.time--;
        if (this.exercise.time === 0) {
          clearInterval(exerciseCountDown);
        }
      }, 1000);
      this.exerciseInterval = exerciseCountDown;
    },
  },
  components: {},
};
</script>


<style scoped>
.exercise_main {
  background-color: black;
  opacity: 0.95;
}
.bounce-enter-active {
  animation: bounce-in 0.6s;
}
.bounce-leave-active {
  animation: bounce-in 0.6s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0.1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.5;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>