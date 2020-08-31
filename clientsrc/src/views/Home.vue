<template class="home">
  <div class="container-fluid gameFont" id="home" style="min-height:100vh;">
    <div class="row justify-content-center pt-3">
      <div class="col-sm-4 col-md-3">
        <button type="button" class="btn btn-block btn-outline-warning" @click="invite">
          <h5 class="py-0">
            <i class="fa fa-envelope" aria-hidden="true"></i> &nbsp;Invite
          </h5>
        </button>
      </div>
      <div class="col-sm-4 col-md-3">
        <button type="button" class="btn btn-block btn-outline-warning" @click="join">
          <h5 class="py-0">
            <i class="fa fa-handshake-o" aria-hidden="true"></i> &nbsp;Join&nbsp;
          </h5>
        </button>
      </div>
    </div>
    <div>
      <Selector key="select_home" v-on:setTopic="setParams($event)" />
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
        <div class="fadeBox">
          <img class="fadeIn" src="../assets/home2.gif" style="width: 30vw;border-radius:90%" />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import router from "../router";
import Selector from "../components/select";
import utils from "../assets/utils";
export default {
  name: "home",
  data() {
    return {
      level: false,
      subject: false,
    };
  },
  computed: {},
  methods: {
    alertLogin() {
      swal({
        title: "You Must First Login.",
        icon: "warning",
        buttons: {
          confirm: { text: "Okay" },
        },
      });
    },
    async login() {
      await this.$auth.loginWithPopup().then(() => {
        this.$store.dispatch("setBearer", this.$auth.bearer);
        this.$store.dispatch("getProfile");
        console.log("this.$auth.user: ");
        console.log(this.$auth.user);
      });
    },
    setParams(s) {
      this.subject = s.subject;
      this.level = s.level;
      console.log(s);
    },
    async invite() {
      if (!this.$auth.isAuthenticated) {
        let loginSuccess = await this.login();
        if (!this.$auth.isAuthenticated) {
          return;
        }
      }
      let id = (Math.random().toString(36) + "0000000000000000000").substr(
        2,
        16
      );
      let html_inject = document.createElement("div");
      html_inject.className = "col-12";
      let title = document.createElement("h4");
      title.innerHTML = `Send Your Friend The Folowing Link To Join You:<br/><i class="fa fa-key" aria-hidden="true"></i>`;
      let h_id = document.createElement("h5");
      h_id.innerText = `${window.origin}/#/game/${id}/invitee`;
      html_inject.appendChild(title);
      html_inject.appendChild(h_id);

      swal({
        icon:
          "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Ficons.iconarchive.com%2Ficons%2Foxygen-icons.org%2Foxygen%2F256%2FApps-preferences-desktop-notification-icon.png&f=1&nofb=1",
        content: html_inject,
        className: "home-swal",
        buttons: {
          one: { text: "Cancel", value: false },
          zero: { text: "Confirm", value: true },
        },
      }).then((value) => {
        if (value) {
          window.stream = new Object();
          window.stream.class = "inviter";
          window.stream.myId = id;
          this.startPlay();
          swal.close();
        } else {
          // window.stream = {};
          // window.stream.class = false;
          swal.close();
        }
      });
    },
    async join() {
      if (!this.$auth.isAuthenticated) {
        let loginSuccess = await this.login();
        if (!this.$auth.isAuthenticated) {
          return;
        }
      }
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
          window.stream = new Object();
          window.stream.class = "invitee";
          window.stream.myId = myId;
          router.push("/game/" + id + "/invitee");
          swal.close()
        } else {
          // window.stream = {};
          // window.stream.class = false;
        }
      });
    },
    async startPlay() {
      if (!this.$auth.isAuthenticated) {
        this.alertLogin();
        return;
      }
      if (window.stream == undefined) {
        window.stream = {};
        window.stream.class = false;
      }
      if (!this.subject) {
        this.$store.dispatch("setSubject", Math.floor(Math.random() * 23) + 9);
      } else {
        this.$store.dispatch("setSubject", this.subject);
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
      } else {
        this.$store.dispatch("setLevel", this.level);
      }

      if (!this.$store.state.triviaToken) {
        const res = await fetch(
          "https://opentdb.com/api_token.php?command=request"
        );
        let token = await res.json();
        this.$store.dispatch("triviaToken", token.token);
      }
      this.subject = "";
      this.level = "";
      if (window.stream.class) {
        router.push("/game/" + window.stream.myId + "/inviter");
      } else {
        router.push({ name: "game" });
      }
    },
  },
  beforeCreate() {},
  created() {},
  beforeMount() {},
  mounted() {
    this.$store.dispatch("loadLeaders");
  },
  components: { Selector },
};
</script>



<style>
.fadeIn {
  box-shadow: 8px 12px 16px 1px rgba(100, 100, 228, 0.4);
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
  border: antiquewhite solid 1px;
  background-color: rgba(39, 91, 151, 0.69);
}
</style>