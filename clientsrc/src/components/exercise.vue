<template>
  <div class="exercise">
    <div class="card" style="width: 40rem;">
      <img class="card-img-top" :src="exercise.example" alt="Card image cap" />
      <div class="card-body">
        <h5 class="card-title">Exercise: {{exercise.exercise}}</h5>
        <p class="card-text" v-if="exercise.notes">
          <b>Notes:</b>
          {{exercise.notes}}
        </p>
      </div>
      <ul class="list-group list-group-flush">
        <li class="list-group-item" v-if="exercise.major_muscle">
          <b>Major Muscle:</b>
          {{exercise.major_muscle}}
        </li>
        <li class="list-group-item" v-if="exercise.minor_muscle">
          <b>Minor Muscle:</b>
          {{exercise.minor_muscle}}
        </li>
        <li class="list-group-item" v-if="exercise.modifications">
          <b>Modifications:</b>
          {{exercise.modifications}}>Vestibulum at eros
        </li>
      </ul>
      <div class="card-body">
        <button class="btn btn-primary" @click="getExercise">Get a Different Exercise</button>
        <button class="btn btn-success" @click="popQuestionSWAL">Finished!</button>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "exercise",
  data() {
    return {};
  },

  mounted() {
    this.$store.dispatch("getExercise");
  },

  computed: {
    exercise() {
      return this.$store.state.exercise;
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
      swal(this.question.question);
    },
  },
  components: {},
};
</script>


<style scoped>
</style>