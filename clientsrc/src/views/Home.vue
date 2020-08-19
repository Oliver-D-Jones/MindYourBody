<template class="home">
  <div class="container-fluid gameFont" id="home" style="min-height:100vh;">
    <div class="row justify-content-center pt-3">
      <div class="col-sm-6 col-md-2">
        <button type="button" class="btn btn-block btn-outline-warning" @click="invite">
          <h5 class="py-0">
            <i class="fa fa-envelope" aria-hidden="true"></i> &nbsp;Invite
          </h5>
        </button>
      </div>
      <div class="col-sm-6 col-md-2">
        <button type="button" class="btn btn-block btn-outline-warning" @click="join">
          <h5 class="py-0">
            <i class="fa fa-handshake-o" aria-hidden="true"></i> &nbsp;Join&nbsp;
          </h5>
        </button>
      </div>
    </div>
    <div class="row p-3" style="justify-content: space-evenly">
      <div class="col-sm-12 col-md-3 text-warning">
        <span>
          <i class="fa fa-tags" aria-hidden="true"></i> &nbsp;CATEGORY
        </span>
        <select
          name="category_id"
          v-model="subject"
          class="form-control dropDown"
          style="border:solid 3px blue;"
          @change="chooseSubject"
        >
          <option>--- Select Subject ---</option>
          <option :value="false" show>Random</option>
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
      </div>
      <div class="col-sm-12 col-md-3 text-warning">
        <span>
          <i class="fa fa-arrows-v" aria-hidden="true"></i> &nbsp;LEVEL
        </span>
        <select
          name="category_id"
          v-model="level"
          @change="chooseLevel"
          class="form-control dropDown"
          style="border:solid 3px blue;"
        >
          <option>--- Select Level ---</option>
          <option :value="false" show>Random</option>
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
      </div>
    </div>
    <div class="row mt-3" style="justify-content: space-evenly">
      <div class="col-xs-12 mt-3">
        <button @click="startPlay()" type="button" class="btn btn-block btn-outline-info">
          <h4 class="pt-2 pb-1">
            <i class="fa fa-superpowers" aria-hidden="true"></i>
            START &nbsp;
          </h4>
        </button>
        <h1 class="comeInStyle my-2">MIND YOUR BODY</h1>
        <img class="wowzors" src="../assets/home2.gif" style="width: 33vw;border-radius:90%" />
      </div>
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
    chooseLevel() {
      this.$store.state.level = event.target.value;
    },
    chooseSubject() {
      this.$store.state.subject = event.target.value;
    },
    invite() {
      let id = (Math.random().toString(36) + "0000000000000000000").substr(
        2,
        16
      );
      let html_inject = document.createElement("div");
      html_inject.className = "col-12";
      let title = document.createElement("h4");
      title.textContent = `Your Room ID Is:`;

      let h_id = document.createElement("h3");
      h_id.innerHTML = `<i class="fa fa-key" aria-hidden="true"></i> &nbsp;${id}`;

      let warning = document.createElement("h5");
      warning.innerHTML = `<i class="fa fa-user-secret" aria-hidden="true"></i> &nbsp;Make Sure To Notify Your Friend Of Your ID.`;
      warning.className = "text-warning";

      html_inject.appendChild(title);
      html_inject.appendChild(h_id);
      html_inject.appendChild(warning);

      swal({
        icon:
          "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Ficons.iconarchive.com%2Ficons%2Foxygen-icons.org%2Foxygen%2F256%2FApps-preferences-desktop-notification-icon.png&f=1&nofb=1",
        closeOnClickOutside: false,
        content: html_inject,
        className: "home-swal",
        buttons: {
          one: { text: "Cancel", value: false },
          zero: { text: "Confirm", value: true },
        },
      }).then((value) => {
        if (value) {
          this.$store.state.stream.class = "inviter";
          this.$store.state.stream.user.id = id;
          this.startPlay();
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
      let myId = (Math.random().toString(36) + "0000000000000000000").substr(
        2,
        16
      );
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
          this.$store.state.stream.user.id = myId;
          this.startPlay();
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
    this.$store.commit("clearStream");
  },
  mounted() {
    this.$store.dispatch("loadLeaders");
  },
  components: {},
};
</script>


<style>
.comeInStyle {
  color: white;
  text-shadow: 2px 3px 4px skyblue;
}

/* Hide scrollbar for Chrome, Safari and Opera */
::-webkit-scrollbar {
  display: none;
}

#home {
  background-image: url("../assets/true.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
.wowzors {
  /* background-color: yellow; */
  box-shadow: 8px 8px 14px blue;
}
.swal-overlay {
  background-color: transparents;
}
.swal-title {
  color: antiquewhite;
}
.swal-modal {
  background-color: black;
  border-left: 4px inset blue;
  border-bottom: 4px inset silver;
  border-right: 4px inset silver;
  border-top: 4px inset blue;

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
  background-color: rgba(39, 91, 151, 0.69);
}
</style>