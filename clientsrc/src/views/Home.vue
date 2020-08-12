<template class="home">
  <div class="container-fluid" v-if="ready">
    <div class="row">
      <!-- <div class="col-12" @load="quiz"></div> -->
      <div class="col-sm-12 col-md-4 pb-0">
        <div class="input-group flex-nowrap rounded shadow mt-3">
          <div class="input-group-prepend">
            <span class="input-group-text" id="addon-wrapping">
              <i class="fa fa-search"></i>
            </span>
          </div>
          <input
            type="search"
            class="form-control"
            placeholder="search a subject"
            aria-label="search"
            aria-describedby="addon-wrapping"
            v-model="searchTerm"
            @input="search()"
          />
        </div>
      </div>
    </div>
    <div class="row py-0" v-for="s in searchResult" :key="s.value">
      <div class="col-sm-12 col-md-4 py-0" style="text-align: start;">
        <input
          class="search py-0 pl-1 rounded shadow"
          type="text"
          readonly
          :value="s.subject"
          @click="getQuiz(s.value)"
          style="cursor:pointer;width:100%;border:none;"
          v-if="searchTerm.length>0"
        />
      </div>
    </div>
    <!-- <div class="container-fluid" v-if="ready">
      <div class="row justify-content-center bg-primary text-light">
        <div class="col-12">
          <p>{{trivia.category}}</p>
        </div>
      </div>
      <div class="row justify-content-center bg-info text-light">
        <div class="col-12 bg-info text-light">{{}}</div>
      </div>
      <div class="row bg-info text-light">
        <div
          class="col-3 custom-control custom-switch justify-content-center"
          v-for="answer in answers"
          :key="answer"
        >
          <input
            :id="'toggle-'+answer"
            type="checkbox"
            class="custom-control-input"
            @click="toggleAnswer(answer)"
          />
          <label class="custom-control-label" :for="'toggle-'+answer">{{ answer }}</label>
        </div>
      </div>
    </div>-->
  </div>
</template>
<script>
export default {
  name: "home",
  data() {
    return {
      answers: null,
      trivia: null,
      ready: false,
      searchTerm: "",
      searchResult: [],
      SUBJECTS: [
        { value: "any", subject: "Random" },
        { value: 9, subject: "general knowledge" },
        { value: 10, subject: "Books" },
        { value: 11, subject: "Film" },
        { value: 12, subject: "Music" },
        { value: 13, subject: "Musicals & Theatre" },
        { value: 14, subject: "Telvision" },
        { value: 15, subject: "Video Games" },
        { value: 16, subject: "Board Games" },
        { value: 17, subject: "Science & Nature" },
        { value: 18, subject: "Computers" },
        { value: 19, subject: "Mathematics" },
        { value: 20, subject: "Mythology" },
        { value: 21, subject: "Sports" },
        { value: 22, subject: "Geography" },
        { value: 23, subject: "History" },
        { value: 24, subject: "Politics" },
        { value: 25, subject: "Art" },
        { value: 26, subject: "Celebrities" },
        { value: 27, subject: "Animals" },
        { value: 28, subject: "Vehicles" },
        { value: 29, subject: "Entertainment" },
        { value: 30, subject: "Gadgets" },
        { value: 31, subject: "Japanese Anime & Manga" },
        { value: 32, subject: "Cartoon & Animations" },
      ],
    };
  },
  computed: {
    // getStateFromLocal({ commit }) {
    //   let data = JSON.parse(window.localStorage.getItem("Bug"));
    //   if (data) {
    //     commit("setActiveBug", data.activeBug)
    //     commit("setActiveNotes", data.activeNotes)
    //   }
    // }
    // saveStateToLocal({ state }) {
    //   let save = { activeBug: state.activeBug, activeNotes: state.activeNotes }
    //   window.localStorage.setItem("Bug", JSON.stringify(save))
    // }
  },
  methods: {
    toggleAnswer(choice) {
      // option.value = !option.value;
      if (choice == this.trivia.correct_answer) {
      }
    },
    search() {
      this.searchResult = [];
      let result = this.SUBJECTS.filter((item) =>
        item.subject.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      result.length = 4;
      result.forEach((obj) => {
        this.searchResult.push(obj);
      });
    },

    async getQuiz(val) {
      const res = await fetch(
        `https://opentdb.com/api.php?amount=1&category=${val}&type=multiple&encode=base64`
      );
      let data = await res.json();
      data = data.results[0];
      for (let property in data) {
        if (Array.isArray(data[property])) {
          data[property].forEach((prop, i, a) => {
            a[i] = atob(prop);
          });
        } else {
          data[property] = atob(data[property]);
        }
      }
      this.trivia = data;
      this.answers = data.incorrect_answers;
      this.answers.push(data.correct_answer);
      this.answers.forEach((v, i, a) => {
        let swap_index = Math.floor(a.length * Math.random());
        let temp = a[swap_index];
        a[swap_index] = v;
        a[i] = temp;
      });

      swal(this.trivia.question, {
        className: "red-bg",
        closeOnClickOutside: false,
        buttons: {
          zero: { text: this.answers[0], value: this.answers[0] },
          two: { text: this.answers[1], value: this.answers[1] },
          three: { text: this.answers[2], value: this.answers[2] },
          four: { text: this.answers[3], value: this.answers[3] },
        },
      }).then((value) => {
        if (value == this.trivia.correct_answer) {
          swal(`${this.trivia.correct_answer}`, "Is Correct!", "success");
        } else {
          swal("Incorrect.", "Try Again.", "error");
        }
      });
    },
  },
  mounted() {
    this.ready = true;
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