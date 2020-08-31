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
      <img
        src="../assets/endWrong.gif"
        style="width: 10%;
      border-radius: 50%;"
        v-if="playerClass != 'invitee'"
        @click="startPlay()"
      />
      <img v-else src="../assets/endWrong.gif" style="width: 10%;
      border-radius: 50%;" />
    </div>
    <h3 v-if="this.answerStreakEarned">
      You earned 20 points for a 5-question streak!
      <img
        src="../assets/coin.gif"
        style="width: 15rem;"
      />
    </h3>
    <h3 v-if="this.dayStreakEarned">
      You earned 20 points for a 5-day streak!
      You have played {{days}} days in a row!
      <img
        src="../assets/coin.gif"
        style="width: 15rem;"
      />
    </h3>
    <h3 v-if="this.megaStreakEarned">
      You earned 100 points for a MEGA-Streak!
      <img src="../assets/coin.gif" style="width: 15rem;" />
    </h3>
    <div v-if="playerClass != 'invitee'">
      <Selector key="select_home" v-on:setTopic="setParams($event)" />
    </div>
    <div class="row mt-3" style="justify-content: space-evenly">
      <div class="col-5">
        <button
          v-if="(playerClass != 'invitee') && (inviteeCompleted)"
          @click="startPlay()"
          class="btn btn-block btn-outline-danger bg-dark py-2"
        >PLAY AGAIN</button>
        <button class="btn btn-block btn-outline-danger bg-dark py-2" v-else>
          Awaiting Friend To Finish Their Round... &nbsp;
          <i
            class="fa fa-spinner fa-spin"
            style="font-size:1.3rem;color:blue"
          ></i>
        </button>
      </div>
      <div class="col-5">
        <button @click="quit()" class="btn btn-block btn-outline-danger bg-dark py-2">QUIT FOR NOW</button>
      </div>
    </div>
  </div>
</template>

<script>
import router from "../router";
import Selector from "../components/select";

export default {
  name: "endgame",
  data() {
    return {
      subject: this.$store.state.subject,
      category: this.$store.state.trivia.category,
      level: this.$store.state.level,
      player: this.$store.state.currentPlayer,
      answer: this.$store.state.answer,
      profile: this.$store.state.profile,
      dayStreak: this.$store.state.currentPlayer.dayStreak,
      dayStreakCount: this.$store.state.currentPlayer.dayStreakCount,
      show: false,
      answerStreakEarned: false,
      megaStreakEarned: false,
      playerClass: window.stream.class,
    };
  },
  mounted() {
    this.$store.dispatch("getTrivia");
    this.$store.dispatch("getProfile");
    this.$store.dispatch("getCurrentPlayer");
    this.$store.dispatch("addStreak", this.dayStreakEarned);
    this.$store.dispatch("getPoints", {
      id: this.playerid,
      streak: this.answerStreak.streak,
      megaStreak: this.answerStreak.megaStreak,
      points: this.points + this.answerStreak.streakPoints,
    });
    this.$store.dispatch("updateCategoryStats", this.categoryStats);
    if (window.stream.class == "invitee") {
      setTimeout((event) => {
        window.stream.connection.send({ class: "inviteeFinished", data: true });
      },3000);
    }
    this.show = true;
  },
  computed: {
    inviteeCompleted() {
      return this.$store.state.roundComplete;
    },
    playerid() {
      return this.$store.state.currentPlayer.profileId;
    },
    days() {
      return this.dayStreak + this.dayStreakCount * 5;
    },
    dayStreakEarned() {
      if ((this.dayStreak + this.dayStreakCount * 5) % 5 === 0) {
        return {
          profileId: this.player.profileId,
          dayStreakCount: this.player.dayStreakCount + 1,
          dayStreak: 0,
        };
      } else {
        return false;
      }
    },
    categoryStats() {
      let y = this.player.categoryStats.findIndex(
        (x) => x.category == this.category
      );
      let playerObject = this.player;
      let foundCategoryStatObject = this.player.categoryStats.find(
        (object) => object.category == this.category
      );
      if (foundCategoryStatObject !== undefined) {
        if (this.answer) {
          playerObject.categoryStats[y].attempted++;
          playerObject.categoryStats[y].correct++;
        } else {
          playerObject.categoryStats[y].attempted++;
        }
        return playerObject;
      }

      if (foundCategoryStatObject === undefined) {
        if (this.answer) {
          playerObject.categoryStats.push({
            category: this.category,
            attempted: (playerObject.categoryStats.attempted = 1),
            correct: (playerObject.categoryStats.correct = 1),
          });
        } else {
          playerObject.categoryStats.push({
            category: this.category,
            attempted: (playerObject.categoryStats.attempted = 1),
            correct: (playerObject.categoryStats.correct = 0),
          });
        }
        return playerObject;
      }
    },

    player() {
      return this.$store.state.currentPlayer;
    },
    answerStreak() {
      let megaStreak = this.$store.state.currentPlayer.megaStreak;
      let streak = this.$store.state.currentPlayer.streak;
      let streakPoints = 0;
      if (!this.answer) {
        streak = 0;
        megaStreak = 0;
      } else {
        streak += 1;
      }
      if (streak === 5) {
        this.answerStreakEarned = true;
        streakPoints += 20;
        streak = 0;
        megaStreak += 1;
      }
      if (megaStreak === 5) {
        this.megaStreakEarned = true;
        streakPoints += 100;
        megaStreak = 0;
      }
      return {
        streak: streak,
        megaStreak: megaStreak,
        streakPoints: streakPoints,
      };
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
  },
  methods: {
    setParams(s) {
      this.subject = s.subject;
      this.level = s.level;
    },
    startPlay() {
      this.show = false;

      if (!this.subject) {
        this.subject = Math.floor(Math.random() * 23) + 9;
      }
      if (this.subject != this.$store.state.subject) {
        this.$store.dispatch("setSubject", this.subject);
      }
      if (this.level != this.$store.state.level) {
        this.$store.dispatch("setLevel", this.level);
      }
      if (window.stream.class == "inviter") {
        this.$store.dispatch("roundCompleted", false);
      }
      this.$emit("init");
      this.subject = "";
      this.level = "";
    },
    quit() {
      this.show = false;
      router.push({ name: "home" });
    },
  },
  components: { Selector },
};
</script>
<style scoped>
</style>