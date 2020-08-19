<template>
  <div class="exercise container mt-2">
    <div class="justify-content-center text-light exercise_main" v-if="show">
      <div class="col-12" style="border:solid 1px silver;">
        <h6 class="py-1 my-2 text-info" style="font-size:x-large">
          <i class="fa fa-question-circle" aria-hidden="true"></i> &nbsp;
          <span id="question"></span>
        </h6>
        <div>
          <img
            class="flyIn card-img-top mt-3"
            id="exerciseImg"
            :src="exercise.example"
            alt="Exercise Example"
            style=" max-width: 100%; max-height:350px; width: auto; height: auto"
          />
        </div>
        <div class="card-body">
          <h2 class="card-title">{{exercise.title}}</h2>
        </div>
        <ul class="list-group list-item">
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
            v
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
  </div>
</template>


<script>
export default {
  name: "exercise",
  data: function () {
    return {
      cheatTimer: 1,
      show: false,
      isDisabled: true,
      exerciseTimerDisabled: false,
      exerciseInterval: null,
      display: "",
    };
  },

  beforeDestroy() {
    this.$store.state.exercise[0] = {};
  },
  beforeMount() {
    this.show = true;
  },
  mounted() {
    if (this.video) {
      this.display = "card col-6 bg-dark";
    } else {
      this.display = "card col-12 bg-dark";
    }
    document.getElementById(
      "question"
    ).innerHTML = this.$store.state.trivia.question;
    this.cheatInterval();
  },
  computed: {
    exercise() {
      return this.$store.state.exercise[0];
    },
    question() {
      return this.$store.state.question;
    },
  },
  methods: {
    getExercise() {
      this.$store.dispatch("getExercise");
      clearInterval(this.exerciseInterval);
      this.exerciseTimerDisabled = false;
      // setTimeout(() => {
      //   document.getElementById("exerciseImg").animate(
      //     [
      //       // keyframes
      //       { transform: "translateX(0px)" },
      //       { transform: "translateY(-30px)" },
      //       { transform: "translateX(30px)" },
      //       { transform: "translateY(-30px)" },
      //     ],
      //     {
      //       // timing options
      //       duration: 100,
      //       iterations: 6,
      //     }
      //   );
      // }, 500);

      // NOTE enable code below to restart Cheat Gaurd when getting new exercise
      // this.isDisabled = true;
      // if (this.cheatTimer === 0) {
      //   this.cheatTimer = 15;
      //   this.cheatInterval();
      // } else {
      //   this.cheatTimer = 15;
      // }
    },
    workOutComplete() {
      document.getElementById("exerciseImg").className = "leaveInStyle";
      setTimeout(() => {
        this.$emit("workoutcomplete", true);
        this.show = false;
      }, 3200);
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
  props: ["video"],
};
</script>


<style scoped>
.exercise_main {
  background-color: black;
  opacity: 0.88;
}
</style>