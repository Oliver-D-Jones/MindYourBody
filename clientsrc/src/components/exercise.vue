<template>
  <div class="exercise container-fluid">
    <div class="row justify-content-center" v-if="show">
      <div class="card col-12">
        <div>
          <img
            class="card-img-top"
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
          </li>
          <li class="list-group-item" v-if="exercise.notes">
            <b>Instructions:</b>
            {{exercise.notes}}
          </li>
        </ul>
        <div class="card-body">
          <button class="btn btn-primary" @click="getExercise">Get a Different Exercise</button>
          <button class="btn btn-success" @click="popQuestionSWAL">Finished!</button>
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
      show: false,
    };
  },

  mounted() {
    this.$store.dispatch("getExercise");
    this.show = true;
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
    },
    popQuestionSWAL() {
      this.show = false;
      this.$emit("workoutcomplete", true);
    },
  },
  components: {},
};
</script>


<style scoped>
</style>