<template class="home">
  <div class="container-fluid">
    <div class="row m-4" style="justify-content: space-evenly">
      <select
        name="category_id"
        @change="selectSubject()"
        v-model="subject"
        class="form-control"
        style="max-width: 35%"
      >
        <option value hidden>Select Subject</option>
        <option>--- Select Subject ---</option>
        <option value="9">Random</option>
        <option value="10">general knowledge</option>
        <option value="11">Books</option>
        <option value="12">Film</option>
        <option value="13">Music</option>
        <option value="14">Musicals & Theatre</option>
        <option value="15">Telvision</option>
        <option value="16">Video Games</option>
        <option value="17">Board Games</option>
        <option value="18">Science & Nature</option>
        <option value="19">Computers</option>
        <option value="20">Mathematics</option>
        <option value="21">Mythology</option>
        <option value="22">Sports</option>
        <option value="23">Geography</option>
        <option value="24">History</option>
        <option value="25">Politics</option>
        <option value="26">Art</option>
        <option value="27">Celebrities</option>
        <option value="28">Animals</option>
        <option value="29">Vehicles</option>
        <option value="30">Entertainment</option>
        <option value="31">Gadgets</option>
        <option value="32">Japanese Anime & Manga</option>
        <option value="33">Cartoon & Animations</option>
      </select>
      <select
        name="category_id"
        @change="selectSubject()"
        v-model="subject"
        class="form-control"
        style="max-width: 35%"
      >
        <option value hidden>Select Level</option>
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
export default {
  name: "home",
  data() {
    return {
      subject: "",
      level: "",
    };
  },
  computed: {},
  methods: {
    startPlay() {
      this.$store.dispatch("getQuestion");
    },
    selectSubject() {},
    selectLevel() {},
  },
  mounted() {},
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