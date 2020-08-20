<template>
  <div class="invitee text-light mt-2">
    <video autoplay="true" id="myVideo" muted controls></video>
    <p>Your ID:</p>
    <span id="myId"></span>
    <div class="col-">
      <video
        autoplay="true"
        id="peerVideo"
        poster="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.giphy.com%2Fmedia%2Fi3pHUtmHiLd28%2Fgiphy.gif&f=1&nofb=1"
        controls
      ></video>
      <p>Peer Id:</p>
      <span id="peerId"></span>
    </div>
    <figure>
      <figcaption>Troubleshoot Audio:</figcaption>
      <audio controls id="myAudio">
        Your browser does not support the
        <code>audio</code> element.
      </audio>
    </figure>
  </div>
</template>


<script>
export default {
  name: "invitee",
  data() {
    return {};
  },
  computed: {},
  methods: {},
  components: {},
  beforeDestroy() {
    // localStream = null;
    // this.conn.close();
    // this.peer.disconnect();
  },
  beforeMount() {
    swal("BM");
    window.remoteId = this.$store.state.stream.peer.id;
  },
  mounted() {
    (function () {
      swal("CRE", window.remoteId);

      /*
NOTE Stored properties on window:

***remoteId
***localId
***localStream
***remoteStream
***connection

    */
      let lastPeerId = null;
      let peer = null; // own peer object
      let conn = null;
      let peer_id = window.remoteId;
      let call = null;

      let getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;
      getUserMedia(
        { video: true, audio: true },
        function (stream) {
          window.localStream = stream;
          document.getElementById("myVideo").srcObject = stream;
        },
        function (err) {
          swal("Failed to get stream", err);
        }
      );

      function init() {
        peer = new Peer(null, {
          debug: 2,
        });
        peer.on("open", function (id) {
          // Workaround for peer.reconnect deleting previous id
          if (peer.id === null) {
            swal("Received null id from peer open");
            peer.id = lastPeerId;
          } else {
            swal("receieved peer.id");
            lastPeerId = peer.id;

            peer.on("connection", function (conn) {
              conn.on("open", function () {
                conn.send("Received A Connection.");
                swal("received a connection");
              });
            });

            peer.on("disconnected", function () {
              swal("Connection lost. Please reconnect").then((res) => {
                peer.id = window.localId;
                peer._lastServerId = window.localId;
                peer.reconnect();
                swal.close();
              });
            });
            peer.on("close", function () {
              conn = null;
              swal("Connection destroyed. Please refresh");
              swal("Connection destroyed");
            });
            peer.on("error", function (err) {
              swal(err);
              swal("" + err);
            });
            peer.on("call", function (call) {
              try {
                swal(
                  "ON PEER CALL==========>w.localStream =",
                  window.localStream
                );
                let myStream = window.localStream;
                call.answer(myStream); // Answer the call with an A/V stream.
              } catch (error) {
                swal("Failed to get/send stream", error);
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
          swal("Connected to: " + conn.peer);
          window.connection = conn;
          document.getElementById(
            "peerId"
          ).textContent = `Connected To: ${conn.peer}`;
          // Check URL params for comamnds that should be sent immediately
          let command = getUrlParam("command");
          if (command) conn.send(command);
        });

        conn.on("data", function (data) {
          //add functionality for sending data;
          swal(data);
        });
        conn.on("close", function () {
          swal("Connection closed");
        });
        call = peer.call(peer_id, window.localStream);
        call.on("stream", function (stream) {
          // `stream` is the MediaStream of the remote peer.
          // Here you'd add it to an HTML video/canvas element.
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
      //     swal(sigName + " signal sent");
      //     addMessage(cueString + sigName);
      //   } else {
      //     swal("Connection is closed");
      //   }
      // }
    })();
  },
};
</script>


<style scoped>
</style>