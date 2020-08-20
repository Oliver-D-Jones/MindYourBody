<template>
  <div>
    <a class="nav-link" data-toggle="modal" href="#profileModal">Profile</a>
    <div class="modal fade" id="profileModal" tabindex="-1" role="dialog" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Profile Stats</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <h2 class="p-2">
              <b class="text-info">{{playerStats.name}}</b>
            </h2>
            <h3 class="p-2">
              Total Points:
              <b class="text-warning">{{playerStats.points}}</b>
            </h3>
            <h5 class="p-1" v-if="playerStats.timeStreakCount === 1">
              PlayStreak:
              <b class="text-warning">{{playerStats.timeStreakCount}}</b> day in a row!
            </h5>
            <h5 class="p-1" v-if="playerStats.timeStreakCount !=1">
              Play Streak:
              <b class="text-warning">{{playerStats.timeStreakCount}}</b> days in a row!
            </h5>
            <h5 class="p-1" v-if="playerStats.streak===1">
              Question Streak:
              <b class="text-warning">{{playerStats.streak}}</b> question in a row!
            </h5>
            <h5 class="p-1" v-if="playerStats.streak!=1">
              Question Streak:
              <b class="text-warning">{{playerStats.streak}}</b> questions in a row!
            </h5>
            <h5 class="p-1" v-if="playerStats.megaStreak === 1">
              MEGA Streak
              <b class="text-warning">{{playerStats.megaStreak}}</b> Question Streak in a row!
            </h5>
            <h5 class="p-1" v-if="playerStats.megaStreak !=1">
              MEGA Streak:
              <b class="text-warning">{{playerStats.megaStreak}}</b> Question Streaks in a row!
            </h5>

            <table class="table table-striped table-hover mt-5">
              <thead>
                <tr>
                  <th>Categories</th>
                  <th>Attempted</th>
                  <th>Correct</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="subject in playerStats.categoryStats" :key="subject.id">
                  <td>{{subject.category}}</td>
                  <td class="text-danger">{{subject.attempted}}</td>
                  <td class="text-success">{{subject.correct}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "profile",
  data() {
    return {};
  },
  computed: {
    playerStats() {
      return this.$store.state.currentPlayer;
    },
    categoryLibrary() {
      return this.$store.state.categoryLibrary;
    },
    // profileScores() {
    //   return this.$store.state.currentPlayer.categoryStats.map((block) => {
    //     block.categoryTitle = this.categoryLibrary.find(
    //       (c) => c.id == block.category
    //     ).name;
    //     return block;
    //   });
    // },
  },
  methods: {},
  components: {},
};
</script>


<style scoped>
</style>