<template>
  <div class="exercise container-fluid">
    <div class="row justify-content-center" v-if="show">
      <div class="card col-12 bg-info">
        <div>
          <img
            class="card-img-top mt-3 border shadow"
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
              class="btn btn-warning"
              v-if="exercise.time"
              @click="exerciseTimer"
            >Start Timer</button>
          </li>
          <li class="list-group-item" v-if="exercise.notes">
            <b>Instructions:</b>
            {{exercise.notes}}
          </li>
        </ul>
        <div class="card-body">
          <button class="btn btn-primary" @click="getExercise" v>Get a Different Exercise</button>
          <button class="btn btn-success" @click="workOutComplete" :disabled="isDisabled">Finished!</button>
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
    };
  },
  mounted() {
    this.$store.dispatch("getExercise");
    this.show = true;
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
      this.isDisabled = true;
      if (this.cheatTimer === 0) {
        this.cheatTimer = 15;
        this.cheatInterval();
      } else {
        this.cheatTimer = 15;
      }
    },
    workOutComplete() {
      this.$emit("workoutcomplete", true);
      this.show = false;
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
      let exerciseInterval = setInterval((interval) => {
        this.exercise.time--;
        if (this.exercise.time === 0) {
          clearInterval(exerciseInterval);
        }
      }, 1000);
    },
  },
  components: {},
};
</script>


<style scoped>
</style>