<template>
  <div class="inviter video-container">
    <!-- PEER VIDEO -->
    <RemoteVideo key="remoteVideo" />
    <div class="col-12 bg-dark">
      <button
        class="btn btn-outline-info btn-sm bg-light mb-1"
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
      <textarea
        v-if="showAllMsg"
        class="bg-dark text-info pt-1"
        style="text-align: center;"
        id="msgAll"
        :value="messageString"
        readonly
      ></textarea>
    </div>
    <!-- "MY VIDEO" -->
    <LocalVideo key="localVideo" />
  </div>
</template>
<script>
import LocalVideo from "./myVideo";
import RemoteVideo from "./peerVideo";
export default {
  name: "inviter",
  data() {
    return {
      messageString: "",
      lastMessage: "No Messages Yet.",
      showAllMsg: false,
      showLastMsg: true,
    };
  },
  computed: {},
  methods: {
    sendMessage(data) {
      let dataToSend = {
        class: "message",
        message: data,
      };
      window.stream.connection.send(dataToSend);
    },
    welcomeInvitee(data) {
      let dataToSend;
      dataToSend = {
        class: "game",
        trivia: this.$store.state.trivia,
        exercise: this.$store.state.exercise,
      };
      window.stream.connection.send(dataToSend);
      dataToSend = {
        class: "name",
        name: this.$store.state.currentPlayer.name,
      };
      window.stream.connection.send(dataToSend);
    },
    respondToInvitee(data) {
      let dataToSend;
      try {
        switch (data.class) {
          case "inviteeReady":
            console.log("IN INVITEE READY");
            this.$store.dispatch("inviteeReady", true);
            this.$emit("inviteeReady");
            return;
          case "inviteeFinished":
            this.$store.dispatch("roundCompleted", true);
            break;
          case "peerName":
            document.getElementById("peerName").textContent = data.name;
            this.$emit("inviteeReady");
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
  components: { LocalVideo, RemoteVideo },
  created() {},
  beforeDestroy() {
    //destroy local stream
    let err = false;
    let _stream, tracks;
    try {
      tracks = stream.localStream.getTracks();
      tracks.forEach(function (track) {
        track.stop();
      });

      if (stream.localPeer) {
        stream.localPeer.destroy();
      }
    } catch (error) {
      err = true;
      console.log(error);
    }
    //destroy remote stream
    try {
      tracks = stream.remoteStream.getTracks();
      tracks.forEach(function (track) {
        track.stop();
      });
    } catch (error) {
      err = error;
      console.log(error);
    }
    window.stream = {};
    window.stream.class = false;
  },
  mounted() {
    window.stream.respondToInvitee = this.respondToInvitee;
    window.stream.welcomeInvitee = this.welcomeInvitee;
    window.stream.sendMessage = this.sendMessage;
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
          window.stream.localPeer = peer;

          peer.on("connection", function (c) {
            // Allow only a single connection for now
            // later create array and push new connetion
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
            window.stream.welcomeInvitee();
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
</style>