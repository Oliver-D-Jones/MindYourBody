<template >
  <div class="card bg-dark text-light mr-5">
    <div class="d-flex" style="justify-content: space-between">
      <div class="ml-3">
        <i class="fa fa-user-circle" aria-hidden="true"></i>
      </div>
      <div>
        <span>{{leader.name}}</span>
      </div>
      <div class="mr-3">
        <span>{{leader.points}}</span>
      </div>
    </div>
  </div>
</template>

           

<script>
export default {
  name: "Leader",
  props: ["leader"],
  mounted() {},
  computed: {},
  methods: {},
  components: {},
};
</script>


<style>
</style>