<template>
  <div v-if="show" class="gameFont text-light">
    <h1 class="mt-4">End of Round</h1>
    <h3 v-if="answer">
      You just earned {{points}} points!
      <img src="../assets/coin.gif" style="width: 10%;" />
    </h3>
    <div v-else>
      <h3>No points this round.</h3>
      <img src="../assets/frown.png" style="width: 10%;" />
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
        <select name="category_id" v-model="subject" class="form-control dropDown">
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
        <select name="category_id" v-model="level" class="form-control dropDown">
          <!-- style="max-width: 35%" -->
          <option value hidden>Level</option>
          <option>--- Select Level ---</option>
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
      </div>
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
      subject: this.$store.state.subject,
      level: this.$store.state.level,
      answer: this.$store.state.answer,
      profile: this.$store.state.profile,
      show: false,
      time: new Date(),
    };
  },
  mounted() {
    this.$store.dispatch("getTrivia");
    this.$store.dispatch("getProfile");
    this.$store.dispatch("getCurrentPlayer");
    this.$store.dispatch("checkPlayer", {
      data: this.profile,
      points: this.points,
      timeStreak: { previousDate: null, recentDate: null },
    });
    this.$store.dispatch("updateTime,", {
      streakCount: this.addStreak,
    });
    this.show = true;
  },

  computed: {
    addStreak() {
      // let oldYear = this.player.recentDate.slice(0, 4);
      // let rawNewYear = this.time.toString();
      // let newYear = rawNewYear.slice(0, 4);
      // let oldDate =
      //   this.player.recentDate.slice(5, 2) + this.player.recentDate.slice(8, 2);
      // let newDate = rawNewYear.slice(5, 2) + rawNewYear.slice(8, 2);
      // let oldYearNum = parseInt(oldYear);
      // let newYearNum = parseInt(newYear);
      // let leapYear =
      //   oldYear == newYear &&
      //   oldYearNum % 4 == 0 &&
      //   !(oldYearNum % 100 == 0 && oldYearNum % 400 == 0) &&
      //   oldDate == "0229" &&
      //   newDate == "0301";
      // if (
      //   (newYearNum == oldYearNum + 1 &&
      //     oldDate == "1231" &&
      //     newDate == "0101") ||
      //   leapYear ||
      //   (oldDate == "0228" && newDate == "0301" && !leapYear) ||
      //   (oldDate == "0131" && newDate == "0201") ||
      //   (oldDate == "0331" && newDate == "0401") ||
      //   (oldDate == "0430" && newDate == "0501") ||
      //   (oldDate == "0630" && newDate == "0701") ||
      //   (oldDate == "0731" && newDate == "0801") ||
      //   (oldDate == "0831" && newDate == "0901") ||
      //   (oldDate == "0930" && newDate == "1001") ||
      //   (oldDate == "1031" && newDate == "1101") ||
      //   (oldDate == "1130" && newDate == "1201")
      // ) {
      //   return this.player.streakCount + 1;
      // }
      return 0;
    },
    gotStreak() {
      // if (this.player.streakCount % 5 == 0) {
      //   this.points += 20;
      //   return true;
      // }
      // return false;
    },
    days() {
      return this.player.streakCount;
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
      return pts;
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
      this.$emit("init", true);
      this.$store.dispatch("switchTimes", {
        timeStreak: {
          previousDate: this.player.timeStreak.recentDate,
          recentDate: this.time.toString(),
        },
      });
    },
    quit() {
      router.push({ name: "home" });
      this.$store.dispatch("switchTimes", {
        timeStreak: {
          previousDate: this.player.timeStreak.recentDate,
          recentDate: this.time.toString(),
        },
      });
    },
  },
  components: {},
};
</script>
<style scoped></style>
