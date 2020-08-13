<template>
  <div>
    <h1>End of Round</h1>
    <h3 v-if="answer">
      You just earned {{points}} points!
      <img src="../assets/coin.gif" style="width: 15rem;" />
    </h3>
    <h3 v-else>No points this round.</h3>
    <img src="../assets/frown.png" style="width: 15rem;" />
    <h3>Play Again?</h3>
    <div class="row m-4" style="justify-content: space-evenly">
      <select name="category_id" v-model="subject" class="form-control" style="max-width: 35%">
        <option value hidden>Subject</option>
        <option>--- Select Subject ---</option>
        <option value="any">Random</option>
        <option value="9">general knowledge</option>
        <option value="10">Books</option>
        <option value="11">Film</option>
        <option value="12">Music</option>
        <option value="13">Musicals & Theatre</option>
        <option value="14">Telvision</option>
        <option value="15">Video Games</option>
        <option value="16">Board Games</option>
        <option value="17">Science & Nature</option>
        <option value="18">Computers</option>
        <option value="19">Mathematics</option>
        <option value="20">Mythology</option>
        <option value="21">Sports</option>
        <option value="22">Geography</option>
        <option value="23">History</option>
        <option value="24">Politics</option>
        <option value="25">Art</option>
        <option value="26">Celebrities</option>
        <option value="27">Animals</option>
        <option value="28">Vehicles</option>
        <option value="29">Entertainment</option>
        <option value="30">Gadgets</option>
        <option value="31">Japanese Anime & Manga</option>
        <option value="32">Cartoon & Animations</option>
      </select>
      <select name="category_id" v-model="level" class="form-control" style="max-width: 35%">
        <option value hidden>Level</option>
        <option>--- Select Level ---</option>
        <option value="easy">easy</option>
        <option value="medium">medium</option>
        <option value="hard">hard</option>
      </select>
    </div>
    <div>
      <button @click="startPlay()" class="btn btn-danger btn-lg border mb-3">START</button>
    </div>
    <h3>OR</h3>
    <div>
      <button @click="quit()" class="btn btn-danger btn-lg border mt-3">QUIT</button>
    </div>
  </div>
</template>

<script>
import router from "../router";
export default {
  name: "endgame",
  data() {
    return {
      subject: "",
      level: "",
    };
    //trigger next to display 'Next Round' Modal component
  },
  mounted() {
    this.$store.dispatch("getAnswer");
    this.$store.dispatch("getTrivia");
  },

  computed: {
    answer() {
      return this.$store.state.answer;
    },
    points() {
      let pts = 0;
      let level = this.$store.state.trivia.difficulty;
      if (level == "easy") {
        pts = 5;
      } else if (level == "medium") {
        pts = 10;
      } else {
        pts = 20;
      }
      return pts;
    },
  },
  methods: {
    startPlay() {
      if (this.subject == "") {
        this.subject = "any";
      }
      if (this.level == "") {
        this.level = "any";
      }
      this.$store.dispatch("setSubject", this.subject);
      this.$store.dispatch("setLevel", this.level);
      console.log(this.subject);
      console.log(this.level);
      this.subject = "";
      this.level = "";
      router.push({ name: "game" });
    },
    quit() {
      router.push({ name: "home" });
    },
  },
  components: {},
};
</script>


<style scoped></style>
