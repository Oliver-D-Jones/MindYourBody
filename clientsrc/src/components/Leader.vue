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
                <div class="card bg-secondary text-light mr-5">
                  <div class="d-flex" style="justify-content: space-between">
                    <div class="ml-3">
                      <i class="fa fa-user-circle text-info" aria-hidden="true"></i>
                    </div>
                    <div>
                      <span>{{leader.name}}</span>
                    </div>
                    <div class="mr-3">
                      <span class="text-warning">{{leader.points}}</span>
                    </div>
                  </div>
                </div>
              </div>
            </ol>
          </h3>

          <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
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