<template>
  <div class="invitee text-light mt-2 border">
    <p class="py-0 bg-info text-dark">
      <span id="myId"></span>
    </p>
    <video
      autoplay="true"
      id="myVideo"
      muted
      controls
      poster="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.giphy.com%2Fmedia%2Fi3pHUtmHiLd28%2Fgiphy.gif&f=1&nofb=1"
    ></video>
    <div class="col-">
      <video
        autoplay="true"
        id="peerVideo"
        poster="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.giphy.com%2Fmedia%2Fi3pHUtmHiLd28%2Fgiphy.gif&f=1&nofb=1"
        controls
      ></video>
      <p class="py-0">
        <span id="peerId"></span>
      </p>
    </div>
    <audio controls volume="true" autoplay id="peerAudio"></audio>
  </div>
</template>
<script>
export default {
  name: "invitee",
  data() {
    return {};
  },
  computed: {},
  methods: {
    setData(data) {
      console.log(data);
    },
  },
  components: {},
  beforeDestroy() {
    // localStream = null;
    // this.conn.close();
    // this.peer.disconnect();
  },
  beforeMount() {
    let vm = this;
    window.stream.setData = function (data, VM = vm) {
      console.log("d===>", data);
      if (data.class == "game") {
        VM.$store.dispatch("inviteeExercise", data.exercise);
        VM.$store.dispatch("inviteeTrivia", data.trivia);
        VM.$emit("inviteeStart");

      } else if (data.class == "beginExercise") {
        console.log("inviteWorkout");
        swal.close();
        VM.$emit("inviteeWorkout");

      } else if (data.class == "workoutComplete") {

        VM.$emit("inviteeWorkoutComplete");
      }
    };
  },
  mounted() {
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
            debug: 2,
          });
        } else {
          try {
            peer = window.stream.localPeer;
            peer.reconnect();
          } catch (error) {
            peer = new Peer(null, {
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
              console.log("" + err);
            });
            peer.on("call", function (call) {
              try {
                let myStream = window.stream.localStream;
                call.answer(myStream); // Answer the call with an A/V stream.
              } catch (error) {
                console.log("Failed to get/send stream", error);
              }
            });
            document.getElementById("myId").textContent = `My Id: ${peer.id}`;
            join();
          }
        });
      }

      function join() {
        // Close old connection
        if (conn) {
          conn.close();
        }

        // Create connection to destination peer specified in the input field
        conn = peer.connect(peer_id, {
          reliable: true,
        });

        conn.on("open", function () {
          console.log("Connected to: " + conn.peer);
          window.stream.connection = conn;
          conn.send("GET DATA");
          document.getElementById(
            "peerId"
          ).textContent = `Connected To: ${conn.peer}`;
          // Check URL params for comamnds that should be sent immediately
          let command = getUrlParam("command");
          if (command) conn.send(command);
        });
        conn.on("data", function (data) {
          console.log("INVITEE REC'D DATA->", data);
          window.stream.setData(data);
        });
        conn.on("close", function () {
          console.log("Connection closed");
        });
        call = peer.call(peer_id, window.stream.localStream);
        call.on("stream", function (stream) {
          // `stream` is the MediaStream of the remote peer.
          // Here you'd add it to an HTML video/canvas element.
          window.stream.call = call;
          window.stream.remoteStream = stream;
          document.getElementById("peerVideo").srcObject = stream;
          // document.getElementById(
          //   "peerAudio"
          // ).srcObject = stream.getAudioTracks()[0];
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