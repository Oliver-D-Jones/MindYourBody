<template class="home">
  <div class="container-fluid">
    <div class="row m-4" style="justify-content: space-evenly">
      <select name="category_id" v-model="subject" class="form-control" style="max-width: 35%">
        <option value hidden>Subject</option>
        <option>--- Select Subject ---</option>
        <option :value="false">Random</option>
        <option value="9">general knowledge</option>
        <option value="10">Books</option>
        <option value="11">Film</option>
        <option value="12">Music</option>
        <option value="13">Musicals & Theatre</option>
        <option value="14">Television</option>
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
      <h1>MIND YOUR BODY</h1>
      <img src="../assets/logo.png" style="width: 20rem;" />
    </div>
    <div>
      <button @click="startPlay()" class="btn btn-danger btn-lg border">START</button>
    </div>
  </div>
</template>
<script>
import router from "../router";
export default {
  name: "home",
  data() {
    return {
      subject: false,
      level: false,
    };
  },
  computed: {},
  methods: {
    startPlay() {
      if (!this.subject) {
        this.$store.dispatch("setSubject", Math.floor(Math.random() * 23) + 9);
      }
      if (!this.level) {
        let level = Math.floor(Math.random() * 3);
        switch (level) {
          case 0:
            level = "easy";
            break;
          case 1:
            level = "medium";
            break;
          case 2:
            level = "hard";
            break;
          default:
            level = "medium";
        }
        this.$store.dispatch("setLevel", level);
      }
      this.subject = false;
      this.level = false;
      router.push({ name: "game" });
    },
  },
  mounted() {
    this.$store.dispatch("loadLeaders");
  },
  components: {},
};
</script>


<style>
.swal-modal {
  background-color: rgba(63, 255, 106, 0.69);
  border: 3px solid white;
  min-width: 60%;
  text-align: center;
  justify-content: center;
  align-content: center;
}
.swal-footer {
  text-align: center;
}
.search:hover {
  color: blue;
  background-color: antiquewhite;
}
</style>