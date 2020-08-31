<template >
  <div>
    <a class="nav-link" data-toggle="modal" href="#leaderboardmodal">Leaderboard</a>
    <!--leadermodal-->
    <div class="modal fade" id="leaderboardmodal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content bg-dark leaderFont">
          <h5 class="modal-title" id="leaderboardmodal"></h5>
          <div class="modal-body text-success">
            <b>TOP POINT EARNERS</b>
          </div>
          <h3>
            <ol>
              <div v-for="leader in leaders" :leader="leader" :key="leader.id">
                <div class="card bg-light text-dark mr-5">
                  <div class="d-flex pt-2" style="justify-content: space-between">
                    <div>
                      <h5>
                        <span class="ml-2">{{leader.name}}</span>
                      </h5>
                    </div>
                    <div class="mr-3">
                      <h5>
                        <span class="text-success">{{leader.points}}</span>
                      </h5>
                    </div>
                  </div>
                </div>
              </div>
            </ol>
          </h3>
          <button type="button" class="btn btn-success mx-4 mb-2" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Leader",
  mounted() {},
  computed: {
    leaders() {
      return this.$store.state.leaders;
    },
    points() {
      return this.$store.state.currentPlayer.points;
    },
  },
  methods: {},
  components: {},
};
</script>
<style>
</style>