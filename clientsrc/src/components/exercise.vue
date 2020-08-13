<template>
  <div class="exercise container-fluid">
    <div class="row justify-content-center" v-if="show">
      <div class="card" style="width: auto">
        <img
          class="card-img-top img-fluid"
          :src="exercise.example"
          alt="Exercise Example"
          style="height: 300px;
          width: auto"
        />
        <div class="card-body">
          <h2 class="card-title">{{exercise.exercise}}</h2>
        </div>
        <ul class="list-group list-item">
          <li class="list-group-item" v-if="exercise.major_muscle">
            <b>Major Muscle:</b>
            {{exercise.major_muscle}}
          </li>
          <li class="list-group-item" v-if="exercise.minor_muscle">
            <b>Minor Muscle:</b>
            {{exercise.minor_muscle}}
          </li>
          <li class="list-group-item" v-if="exercise.notes">
            <b>Notes:</b>
            {{exercise.notes}}
          </li>
          <li class="list-group-item" v-if="exercise.modifications">
            <b>Modifications:</b>
            {{exercise.modifications}}
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
  data: function(){
    return{
      show :false
    }
 
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