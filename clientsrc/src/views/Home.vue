<template class="home">
  <div class="container-fluid gameFont" style="min-height: 100vh">
    <div class="row justify-content-center mt-2">
      <div class="col-sm-6 col-md-2">
        <button class="btn btn-block btn-warning" @click="invite">Invite</button>
      </div>
      <div class="col-sm-6 col-md-2">
        <button class="btn btn-block btn-success" @click="join">Join</button>
      </div>
    </div>
    <div class="row p-4" style="justify-content: space-evenly">
      <select
        name="category_id"
        v-model="subject"
        class="form-control dropDown"
        style="max-width: 35%; margin-top: 3rem"
      >
        <option value hidden>Subject</option>
        <option>--- Select Subject ---</option>
        <option :value="false">Random</option>
        <option value="9">general knowledge</option>
        <option value="10">Books</option>
        <option value="11">Film</option>
        <option value="12">Music</option>
        <option value="13">Musicals & Theatre</option>
        <option value="14">Television</option>
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
      <select
        name="category_id"
        v-model="level"
        class="form-control dropDown"
        style="max-width: 35%; margin-top: 3rem"
      >
        <option value hidden>Level</option>
        <option>--- Select Level ---</option>
        <option value="easy">easy</option>
        <option value="medium">medium</option>
        <option value="hard">hard</option>
      </select>
    </div>
    <div style="margin-top: 3rem">
      <h1>MIND YOUR BODY</h1>
      <img src="../assets/logo.png" style="width: 20rem;" />
    </div>
    <div>
      <button @click="startPlay()" class="btn btn-danger btn-lg border mb-4 mt-3">START</button>
    </div>
  </div>
</template>
<script>
import router from "../router";
export default {
  name: "home",
  data() {
    return {
      subject: false,
      level: false,
    };
  },
  computed: {},
  methods: {
    invite() {
      console.log(this.$store.state.profile);
      let id = (Math.random().toString(36) + "0000000000000000000").substr(
        2,
        16
      );
      let html_inject = document.createElement("div");
      html_inject.className = "col-12";
      let title = document.createElement("h4");
      title.textContent = `Your Room ID Is:`;

      let p_id = document.createElement("p");
      p_id.textContent = id;

      let warning = document.createElement("p");
      warning.textContent = "Make Sure To Notify Your Friend Of Your ID.";

      html_inject.appendChild(title);
      html_inject.appendChild(p_id);
      html_inject.appendChild(warning);

      swal({
        icon:
          "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Ficons.iconarchive.com%2Ficons%2Foxygen-icons.org%2Foxygen%2F256%2FApps-preferences-desktop-notification-icon.png&f=1&nofb=1",
        closeOnClickOutside: false,
        content: html_inject,
        className: "home-swal",
        buttons: {
          zero: { text: "Confirm", value: true },
          one: { text: "Cancel", value: false },
        },
      }).then((value) => {
        if (value) {
          this.$store.state.stream.class = "inviter";
          this.$store.state.stream.user.id = id;
          swal.close();
        } else {
          this.$store.state.stream.class = false;
          this.$store.state.stream.user.id = null;
          swal.close();
        }
      });
    },
    join() {
      let html_inject = document.createElement("input");
      html_inject.id = "peerId";

      swal({
        title: "Enter The Id Of The Peer You Want To Join",
        content: html_inject,
        className: "home-swal",
        buttons: true,
      }).then((html_inject) => {
        let id = document.getElementById("peerId").value;
        if (id) {
          //NOTE set peer to join ID
          this.$store.state.stream.class = "invitee";
          this.$store.state.stream.peer.id = id;
          console.log("invitee", id);
        } else {
          //NOTE set peer to join ID
          this.$store.state.stream.class = false;
          this.$store.state.stream.peer.id = null;
        }
      });
    },

    startPlay() {
      if (!this.subject) {
        this.$store.dispatch("setSubject", Math.floor(Math.random() * 23) + 9);
      }
      if (!this.level) {
        let level = Math.floor(Math.random() * 3);
        switch (level) {
          case 0:
            level = "easy";
            break;
          case 1:
            level = "medium";
            break;
          case 2:
            level = "hard";
            break;
          default:
            level = "medium";
        }
        this.$store.dispatch("setLevel", level);
      }
      this.subject = false;
      this.level = false;
      router.push({ name: "game" });
    },
  },
  beforeCreate() {
    console.log("in BC home");
    this.$store.commit("clearStream");
  },
  mounted() {
    this.$store.dispatch("loadLeaders");
  },
  components: {},
};
</script>


<style>
.swal-overlay {
  background-color: transparent;
}
.swal-title {
  color: antiquewhite;
}
.swal-modal {
  background-color: black;
  border: 6px inset gold;
  color: white;
  min-width: 60%;
  min-height: 50%;
  text-align: center;
  justify-content: center;
  align-content: center;
}
.swal-footer {
  text-align: center;
}

.swal-text {
  color: white;
}
.swal-icon img {
  max-width: 10%;
  border-radius: 5%;
  border: antiquewhite solid 2px;
  background-color: rgba(63, 255, 106, 0.69);
}
</style>