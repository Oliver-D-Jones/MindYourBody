<template>
  <div>
    <a class="nav-link" data-toggle="modal" href="#profileModal">Stats</a>
    <div class="modal fade" id="profileModal" tabindex="-1" role="dialog">
      <div class="modal-dialog p-lg-5" role="document" style="min-width: -webkit-fill-available;">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-success" id="exampleModalLabel">Profile Stats</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <h2 class="p-2">
              <b class="text-info">{{playerStats.name}}</b>
            </h2>
            <h3 class="p-2 text-light">
              Total Points:
              <b class="text-success">{{playerStats.points}}</b>
            </h3>

            <h5 class="p-1 text-light" v-if="playerStats.streak===1">
              Question Streak: &nbsp
              <b class="text-warning">{{playerStats.streak}}</b> /
              <span class="text-warning">5</span> Questions Correct
            </h5>
            <h5 class="p-1 text-light" v-if="playerStats.streak!=1">
              Question Streak: &nbsp
              <b class="text-warning">{{playerStats.streak}}</b> /
              <span class="text-warning">5</span> Questions Correct
            </h5>
            <h5 class="p-1 text-light" v-if="playerStats.megaStreak === 1">
              MEGA-Streak: &nbsp
              <b class="text-warning">{{playerStats.megaStreak}}</b> /
              <span class="text-warning">5</span> Streaks Complete
            </h5>
            <h5 class="p-1 text-light" v-if="playerStats.megaStreak !=1">
              MEGA-Streak: &nbsp
              <b class="text-warning">{{playerStats.megaStreak}}</b> /
              <span class="text-warning">5</span> Streaks Complete
            </h5>

            <table class="table mt-5">
              <thead>
                <tr>
                  <th>Categories</th>
                  <th>Attempted</th>
                  <th>Correct</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="subject in playerStats.categoryStats" :key="subject.id">
                  <td class="text-info">{{subject.category}}</td>
                  <td class="text-danger">{{subject.attempted}}</td>
                  <td class="text-success">{{subject.correct}}</td>
                  <td
                    class="text-warning"
                    style="white-space: nowrap;"
                  >{{ Math.trunc(subject.correct / subject.attempted * 100) }} %</td>
                </tr>
              </tbody>
            </table>
          </div>

          <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
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