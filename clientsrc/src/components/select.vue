<template>
  <div class="selector row mt-3" style="justify-content: space-evenly">
    <div class="col-sm-12 col-md-3 text-warning">
      <span>
        <i class="fa fa-tags" aria-hidden="true"></i> &nbsp;CATEGORY
      </span>
      <select
        name="category_id"
        v-model="subject"
        class="form-control dropDown"
        style="border:solid 3px blue;"
        @change="chooseSubject"
      >
        <option>--- Select Subject ---</option>
        <option :value="false" show>Random</option>
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
    </div>
    <div class="col-sm-12 col-md-3 text-warning">
      <span>
        <i class="fa fa-arrows-v" aria-hidden="true"></i> &nbsp;LEVEL
      </span>
      <select
        name="category_id"
        v-model="level"
        @change="chooseLevel"
        class="form-control dropDown"
        style="border:solid 3px blue;"
      >
        <option>--- Select Level ---</option>
        <option :value="false" show>Random</option>
        <option value="easy">easy</option>
        <option value="medium">medium</option>
        <option value="hard">hard</option>
      </select>
    </div>
  </div>
</template>


<script>
export default {
  name: "selector",
  data() {
    return {
      subject: false,
      level: false,
    };
  },
  computed: {},
  methods: {
    chooseLevel() {
      this.$store.state.level = event.target.value;
      this.$emit("setTopic", {level:this.level,subject:this.subject});
    },
    chooseSubject() {
      this.$store.state.subject = event.target.value;
      this.$emit("setTopic", {level:this.level,subject:this.subject});
    },
  },
  components: {},
};
</script>


<style scoped>
</style>