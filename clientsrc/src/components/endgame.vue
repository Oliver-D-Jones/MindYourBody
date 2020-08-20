<template>
  <div v-if="show" class="gameFont text-light" style="min-height:100vh">
    <h1 class="mt-4">End of Round</h1>
    <h3 v-if="answer">
      You just earned {{points}} points!
      <img
        src="../assets/spin.gif"
        style="width: 10%;border-radius:100%"
        id="endCoin"
        class="simpleEntrance"
      />
      <span class="blazingStarText">X {{points}}</span>
    </h3>
    <div v-else>
      <h3>No points this round.</h3>
      <img src="../assets/frown.png" style="width: 10%;border-radius:100%" />
      <h3>Play Again?</h3>
    </div>
    <h3 v-if="gotStreak">
      You earned 20 points for a 5-day streak!
      You have played for {{days}} days straight!
      <img
        src="../assets/coin.gif"
        style="width: 15rem;"
      />
    </h3>
    <div class="row m-4" style="justify-content: space-evenly">
      <div class="col-sm-12 col-md-4">
        <select
          name="category_id"
          v-model="subject"
          class="form-control dropDown"
          style="width: -webkit-fill-available;"
        >
          <!-- style="max-width: 35%" -->
          <option value hidden>Subject</option>
          <option>--- Select Subject ---</option>
          <option value="false">Random</option>
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
      </div>
      <div class="col-sm-12 col-md-4">
        <select
          name="category_id"
          v-model="level"
          class="form-control dropDown"
          style="width: -webkit-fill-available;"
        >
          <!-- style="max-width: 35%" -->
          <option value hidden>Level</option>
          <option>--- Select Level ---</option>
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
      </div>
    </div>
    <div class="row" style="justify-content: space-evenly">
      <div class="col-5">
        <button
          @click="startPlay()"
          class="btn btn-block btn-outline-danger bg-dark py-2"
        >PLAY AGAIN</button>
      </div>
      <div class="col-5">
        <button @click="quit()" class="btn btn-block btn-outline-danger bg-dark py-2">QUIT FOR NOW</button>
      </div>
    </div>
  </div>
</template>

<script>
import router from "../router";
export default {
  name: "endgame",
  data() {
    return {
      subject: this.$store.state.subject,
      level: this.$store.state.level,
      answer: this.$store.state.answer,
      profile: this.$store.state.profile,
      player: this.$store.state.currentPlayer,
      show: false,
      time: new Date(),
    };
  },
  mounted() {
    setTimeout(() => {
      document.getElementById("endCoin").className = "blazingStar";
    }, 6000);
    this.$store.dispatch("getTrivia");
    this.$store.dispatch("getProfile");
    this.$store.dispatch("getCurrentPlayer");
    this.$store.dispatch("updateStreak", {
      id: this.playerid,
      number: this.addStreak,
    });
    this.$store.dispatch("getPoints", {
      id: this.playerid,
      points: this.points,
    });
    this.show = true;
  },
  computed: {
    playerid() {
      return this.$store.state.currentPlayer.profileId;
    },
    checkStreak() {
      let prev = parseInt(this.player.previousDate);
      let rec = parseInt(this.player.recentDate);
      let prevDate = new Date(prev);
      let recDate = new Date(rec);
      let prevYear = prevDate.getFullYear();
      let recYear = recDate.getFullYear();
      let prevYearNum = parseInt(prevYear);
      let recYearNum = parseInt(recYear);
      let prevMonth = ("0" + (prevDate.getMonth() + 1)).slice(-2);
      let recMonth = ("0" + (recDate.getMonth() + 1)).slice(-2);
      let prevDay = ("0" + prevDate.getDate()).slice(-2);
      let recDay = ("0" + recDate.getDate()).slice(-2);
      let previDom = prevMonth + prevDay;
      let receDom = recMonth + recDay;
      let previ = prevYear + prevMonth + prevDay;
      let rece = recYear + recMonth + recDay;
      let prevDom = parseInt(previDom);
      let recDom = parseInt(receDom);
      let previous = parseInt(previ);
      let recent = parseInt(rece);
      let leapYear =
        prevYearNum == recYearNum &&
        prevYearNum % 4 == 0 &&
        prevDom == 229 &&
        recDom == 301;
      if (
        (recYearNum == prevYearNum + 1 && prevDom == 1231 && recDom == 101) ||
        (!leapYear && prevDom == 228 && recDom == 301) ||
        (prevYearNum == recYearNum && recDom == prevDom + 1) ||
        (prevDom == 131 && recDom == 201) ||
        (prevDom == 229 && recDom == 301) ||
        (prevDom == 331 && recDom == 401) ||
        (prevDom == 430 && recDom == 501) ||
        (prevDom == 630 && recDom == 701) ||
        (prevDom == 731 && recDom == 801) ||
        (prevDom == 831 && recDom == 901) ||
        (prevDom == 930 && recDom == 1001) ||
        (prevDom == 1031 && recDom == 1101) ||
        (prevDom == 1130 && recDom == 1201)
      ) {
        return 1;
      }
      return 0;
    },
    addStreak() {
      if (this.checkStreak == 1) {
        return this.player.timeStreakCount + 1;
      } else {
        return 0;
      }
    },
    gotStreak() {
      if (this.player.timeStreakCount % 5 == 0) {
        return 20;
      }
      return false;
    },
    days() {
      return this.player.timeStreakCount;
    },
    points() {
      let pts = 0;
      let level = this.$store.state.trivia.difficulty;
      let answer = this.$store.state.answer;
      if (level == "easy" && answer) {
        pts = 5;
      } else if (level == "medium" && answer) {
        pts = 10;
      } else if (level == "hard" && answer) {
        pts = 20;
      } else {
        pts = 0;
      }
      return pts + this.gotStreak;
    },
    streak() {
      let streak = this.$store.currentPlayer.streak;
      if (this.points > 0) {
        streak++;
        console.log("streak increased");
      }
      if (streak == 2) {
        this.points += 20;
        console.log("Five in a row. You got a streak!");
      }
    },
  },
  methods: {
    startPlay() {
      this.show = false;
      if (!this.subject) {
        this.$store.dispatch("setSubject", Math.floor(Math.random() * 23) + 9);
      }
      if (this.subject != this.$store.state.subject) {
        this.$store.dispatch("setSubject", this.subject);
      }
      if (this.level != this.$store.state.level) {
        this.$store.dispatch("setLevel", this.level);
      }
      this.subject = "";
      this.level = "";


    },
    quit() {
      router.push({ name: "home" });
    },
  },
  components: {},
};
</script>
<style scoped>
.gameFont {
  background-image: url("../assets/end.jpg");
}
</style>
