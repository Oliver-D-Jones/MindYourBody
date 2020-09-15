<template>
  <div class="about">
    <a class="nav-link" data-toggle="modal" href="#aboutmodal">About</a>
    <div class="modal fade" id="aboutmodal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-success" id="aboutmodal">Directions</h5>
          </div>
          <div class="modal-body text-justify text-light">
            <p>Welcome to 'Mind Your Body', the total app for the whole person. Press 'start' to receive a question that tests your knowledge. When you are ready, press 'start exercise' and you will be given a physical exercise. While you exercise, consider the answer to the question. When you finish the exercise, press 'complete' and choose the best answer to your question. A right answer earns you 5 points for an easy question, 10 points for an intermediate question, and 20 points for a difficult question. You may change the exercise before beginning. Repeat as many times as you like for a full workout of both your body and your brain.</p>
          </div>
          <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  name: "about",
  data() {
    return {};
  },
  computed: {},
  methods: {},
  components: {},
};
</script>


<style scoped>
</style>