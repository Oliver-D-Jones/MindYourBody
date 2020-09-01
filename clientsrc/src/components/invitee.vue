<template>
  <div class="invitee video-container">
    <!-- PEER VIDEO -->
    <RemoteVideo key="remoteVideo" />
    <!-- "MY VIDEO" -->
    <LocalVideo key="localVideo" />
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
        class="bg-dark text-info pt-1 text-align: center;"
        readonly
        id="msgAll"
        :value="messageString"
      ></textarea>
    </div>
  </div>
</template>
<script>
import LocalVideo from "./myVideo";
import RemoteVideo from "./peerVideo";
export default {
  name: "invitee",
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
    respondToInviter(data) {
      switch (data.class) {
        case "game":
          this.$store.dispatch("inviteeExercise", data.exercise);
          this.$store.dispatch("inviteeTrivia", data.trivia);
          break;
        case "beginExercise":
          swal.close();
          this.$emit("inviteeWorkout");
          break;
        case "workoutComplete":
          this.$emit("inviteeWorkoutComplete");
          break;
        case "newExercise":
          this.$store.dispatch("inviteeExercise", data.exercise);
          break;
        case "replay":
          this.$store.dispatch("inviteeExercise", data.exercise);
          this.$store.dispatch("inviteeTrivia", data.trivia);
          this.$emit("init");
          break;
        case "message":
          let time = new Date().toLocaleTimeString();
          let _string = time + " - " + data.message;
          this.lastMessage = _string;
          this.messageString += _string + "\n";
          break;
        case "name":
          document.getElementById("peerName").textContent = data.name;
          let _me = this.$auth.user.name;
          window.stream.connection.send({ class: "peerName", name: _me });
          break;
        default:
          console.log(data);
      }
    },
  },
  components: { LocalVideo, RemoteVideo },
  beforeDestroy() {
    //destroy local stream
    let err = false;
    let tracks;
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
    window.stream.respondToInviter = this.respondToInviter;
    window.stream.sendMessage = this.sendMessage;

    (function () {
      let lastPeerId = null;
      let peer = null; // own peer object
      let conn = null;
      let peer_id = window.stream.peerId;
      let call = null;

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
          console.log("Failed to get stream", err);
        }
      );
      function init() {
        if (!window.stream.localPeer) {
          peer = new Peer(null, {
            secure: true,
            debug: 2,
          });
        } else {
          try {
            peer = window.stream.localPeer;
            peer.reconnect();
          } catch (error) {
            peer = new Peer(null, {
              secure: true,
              debug: 2,
            });
          }
        }
        peer.on("open", function (id) {
          // Workaround for peer.reconnect deleting previous id
          if (peer.id === null) {
            console.log("Received null id from peer open");
            peer.id = lastPeerId;
          } else {
            console.log("receieved peer.id");
            lastPeerId = peer.id;

            peer.on("connection", function (conn) {
              conn.on("open", function () {
                conn.send("Received A Connection.");
                console.log("received a connection");
              });
            });

            peer.on("disconnected", function () {
              console.log("Connection lost. Please reconnect").then((res) => {
                peer.id = window.stream.localId;
                peer._lastServerId = window.stream.localId;
                peer.reconnect();
                console.log.close();
              });
            });
            peer.on("close", function () {
              conn = null;
              console.log("Connection destroyed. Please refresh");
              console.log("Connection destroyed");
            });
            peer.on("error", function (err) {
              console.log(err);
            });
            peer.on("call", function (call) {
              try {
                let myStream = window.stream.localStream;
                call.answer(myStream); // Answer the call with an A/V stream.
              } catch (error) {
                console.log("Failed to get/send stream", error);
              }
            });
            join();
          }
        });
      }

      function join() {
        // Close old connection
        console.log(stream.connection);
        if (window.stream.connection) {
          window.stream.connection.close();
        }

        // Create connection to destination peer specified in the input field
        conn = peer.connect(peer_id, {
          reliable: true,
        });

        conn.on("open", function () {
          console.log("Connected to: " + conn.peer);
          window.stream.connection = conn;
          // conn.send({ class: "GET DATA" });
          // conn.send({ class: "namePlease" });
          // document.getElementById(
          //   "peerId"
          // ).textContent = `Connected To: ${conn.peer}`;
          // Check URL params for comamnds that should be sent immediately
          let command = getUrlParam("command");
          if (command) conn.send(command);
        });
        conn.on("data", function (data) {
          window.stream.respondToInviter(data);
        });
        conn.on("close", function () {
          console.log("Connection closed");
        });
        call = peer.call(peer_id, window.stream.localStream);
        call.on("stream", function (stream) {
          // `stream` is the MediaStream of the remote peer.
          // Here you'd add it to an HTML video/canvas element.
          window.stream.remoteStream = stream;
          document.getElementById("peerVideo").srcObject = stream;
        });
      }

      /**
       * Get first "GET style" parameter from href.
       * This enables delivering an initial command upon page load.
       *
       * Would have been easier to use location.hash.
       */
      function getUrlParam(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);
        if (results == null) return null;
        else return results[1];
      }
      init();
      /**
       * Send a signal via the peer connection and add it to the log.
       * This will only occur if the connection is still alive.
       */
      // function signal(sigName) {
      //   if (conn && conn.open) {
      //     conn.send(sigName);
      //     console.log(sigName + " signal sent");
      //     addMessage(cueString + sigName);
      //   } else {
      //     console.log("Connection is closed");
      //   }
      // }
    })();
  },
};
</script>


<style>
</style>