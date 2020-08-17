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
            <h2>Name: {{playerStats.name}}</h2>
            <h2>Points: {{playerStats.points}}</h2>
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
  },
  methods: {},
  components: {},
};
</script>


<style scoped>
</style>