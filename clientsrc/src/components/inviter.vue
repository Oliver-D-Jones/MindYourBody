<template>
  <div
   class="inviter text-light mt-2"
    style="">
    <p
      class="pb-0 text-dark"
      style="border: 1px solid black;
      border-radius: 5%;
    background-color: white;"
    >
      <span>{{me}}</span>
      <br />
      <span id="myId"></span>
    </p>
    <video
      autoplay="true"
      id="myVideo"
      class="mb-1"
      muted
      controls
      poster="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.giphy.com%2Fmedia%2Fi3pHUtmHiLd28%2Fgiphy.gif&f=1&nofb=1"
    ></video>
    <div>
      <p
        class="pb-0 text-dark"
        style="border: 1px solid black;
    border-radius: 5%;
    background-color: lightblue;"
      >
        <span>{{peer}}</span>
      </p>
      <video
        autoplay="true"
        id="peerVideo"
        class="mb-1"
        poster="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.giphy.com%2Fmedia%2Fi3pHUtmHiLd28%2Fgiphy.gif&f=1&nofb=1"
        controls
      ></video>
    </div>

    <div class="py-1">
      <button
        class="btn btn-outline-info btn-sm bg-light"
        @click="()=>{
        showAllMsg = !showAllMsg;
        showLastMsg = !showLastMsg;
        }"
      >
        <i class="fa fa-comments fa-2x" aria-hidden="true" v-if="showLastMsg"></i>
        <i class="fa fa-comment fa-2x" aria-hidden="true" v-else></i>
      </button>
      <br />
      <p class="bg-dark text-info rounded" v-if="showLastMsg" id="msgOne">{{lastMessage}}</p>
      <textarea v-if="showAllMsg" class="bg-dark text-info pt-2" id="msgAll" :value="messageString"></textarea>
    </div>
  </div>
</template>
<script>
export default {
  name: "inviter",
  data() {
    return {
      messageString: "",
      lastMessage: "No Messages Yet.",
      showAllMsg: false,
      showLastMsg: true,
      me: this.$store.state.currentPlayer.name,
      peer: "",
    };
  },
  computed: {},
  methods: {
    respondToInvitee(data) {
      let dataToSend;
      try {
        switch (data.class) {
          case "GET DATA":
            dataToSend = {
              class: "game",
              trivia: this.$store.state.trivia,
              exercise: this.$store.state.exercise,
            };
            break;
          case "namePlease":
            dataToSend = {
              class: "name",
              name: this.$store.state.currentPlayer.name,
            };
            break;
          case "peerName":
            this.peer = data.name;
            return;
          case "message":
            let time = new Date().toLocaleTimeString();
            let _string = time + " - " + data.message;
            this.lastMessage = _string;
            this.messageString += _string + "\n";
            return;
          default:
            dataToSend = {
              class: "message",
              message: "error; make sure to specify class.",
            };
        }
        window.stream.connection.send(dataToSend);
      } catch (error) {
        console.log(error);
      }
    },
  },
  components: {},
  beforeCreate() {
  },
  beforeDestroy() {
    // localStream = null;
    // console.log(this.conn, this.localPeer);
    // this.conn.close();
    // this.localPeer.destroy();
  },
  mounted() {
    window.stream.respondToInvitee = this.respondToInvitee;
    (function () {
      let lastPeerId = null;
      let peer = null; // own peer object
      let conn = null;
      let call = null;
      let myId = window.stream.myId;

      let getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia(
        { video: true, audio: true },
        function (stream) {
          window.stream.localStream = stream;
          document.getElementById("myVideo").srcObject = stream;
        },
        function (err) {
          console.log("Failed to get stream " + err);
        }
      );

      /**
       * Create the Peer object for our end of the connection.
       *
       * Sets up callbacks that handle any events related to our
       * peer object.
       */
      function init() {
        // Create own peer object with connection to shared PeerJS server
        if (!window.stream.localPeer) {
          peer = new Peer(myId, {
            secure: true,
            // host: "mind-your-body.herokuapp.com",
            // port: 443,
            debug: 2,
          });
        } else {
          try {
            peer = window.stream.localPeer;
            peer.reconnect();
          } catch (error) {
            console.log(error);
            peer = new Peer(myId, {
              secure: true,
              // host: "mind-your-body.herokuapp.com",
              // port: 443,
              debug: 2,
            });
          }
        }

        peer.on("open", function (id) {
          // Workaround for peer.reconnect deleting previous id
          if (peer.id === null) {
            peer.id = lastPeerId;
          } else {
            lastPeerId = peer.id;
          }
          document.getElementById("myId").textContent = `My ID: ${peer.id}`;
          window.stream.localPeer = peer;

          peer.on("connection", function (c) {
            // Allow only a single connection for now
            //later create array and push new connetion
            // if (conn && conn.open) {
            //   c.on("open", function () {
            //     c.send("Already connected to another client");
            //     setTimeout(function () {
            //       c.close();
            //     }, 500);
            //   });
            //   return;
            // }
            conn = c;
            ready();
          });

          peer.on("disconnected", function () {
            console.log("Connection lost. Please reconnect");
            swal("Connection Destroyed")
            // Workaround for peer.reconnect deleting previous id
            // peer.id = lastPeerId;
            // peer._lastServerId = lastPeerId;
            // peer.reconnect();
          });

          peer.on("close", function () {
            conn = null;
            console.log("Connection destroyed");
          });
          peer.on("error", function (err) {
            let error = "Error: " + err;
            console.log(error);
            peer.close();
          });
          peer.on("call", function (call) {
            try {
              let myStream = window.stream.localStream;
              call.answer(myStream); // Answer the call with an A/V stream.
              call.on("stream", function (stream) {
                // Show stream in some video/canvas element.
                document.getElementById("peerVideo").srcObject = stream;
                window.stream.remoteStream = stream;
              });
            } catch (error) {
              console.log("Failed to get/send stream " + error);
            }
          });
        });

        /**
         * Triggered once a connection has been achieved.
         * Defines callbacks to handle incoming data and connection events.
         */

        function ready() {
          conn.on("open", function () {
            console.log("conn opened");
            window.stream.connection = conn;
          });
          conn.on("data", function (data) {
            window.stream.respondToInvitee(data);
          });
          conn.on("close", function () {
            console.log("Connection reset. Awaiting connection...");
            conn = null;
          });
        }
      }
      init();
    })();
  },
};
</script>

<style>
#msgAll {
  min-width: -webkit-fill-available;
  padding: 4px;
  border: 1px solid white;
}
</style>