<template>
  <div class="inviter text-light mt-2">
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
      <button class="btn btn-block btn-outline-warning" @click="getInfo">Troubleshoot</button>
    </div>
    <figure>
      <figcaption>Troubleshoot Audio</figcaption>
      <audio controls id="myAudio">
        Your browser does not support the
        <code>audio</code> element.
      </audio>
    </figure>
  </div>
</template>


<script>
export default {
  name: "inviter",
  data() {
    return {
      localPeer: null,
      conn: null,
      lastId:null,
    };
  },
  computed: {},
  methods: {
    getInfo() {
      console.log(localPeer, connection, localStream, remoteStream);
    },
  },
  components: {},
  beforeDestroy() {
    // localStream = null;
    // console.log(this.conn, this.localPeer);
    // this.conn.close();
    // this.localPeer.destroy();
  },
  beforeMount() {
    window.localId = this.$store.state.stream.user.id;
    console.log("BM-localId-->", window.localId);
  },
  mounted() {
    (function () {
      let lastPeerId = null;
      this.lastId = lastPeerId;
      let peer = null; // own peer object
      let conn = null;
      let call = null;
      let myId = window.localId;

      let getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia(
        { video: true, audio: true },
        function (stream) {
          swal("GET USER MEDIA", stream);
          window.localStream = stream;
          document.getElementById("myVideo").srcObject = stream;

          // document.getElementById("myAudio").srcObject = stream;
        },
        function (err) {
          swal("Failed to get stream", err);
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
        peer = new Peer(myId, {
          debug: 2,
        });

        peer.on("open", function (id) {
          // Workaround for peer.reconnect deleting previous id
          if (peer.id === null) {
            peer.id = lastPeerId;
          } else {
            lastPeerId = peer.id;
          }
          // document.getElementById("myId").textContent = `${peer.id}`;
          document.getElementById("myId").textContent = `${peer.id}`;
          window.localPeer = peer;

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
            window.connection = c;
            swal("conn",conn);
            document.getElementById("peerId").textContent = `${conn.peer}`;
            ready();
          });

          peer.on("disconnected", function () {
            swal("Connection lost. Please reconnect");

            // Workaround for peer.reconnect deleting previous id
            peer.id = lastPeerId;
            peer._lastServerId = lastPeerId;
            peer.reconnect();
          });

          peer.on("close", function () {
            conn = null;
            swal("Connection destroyed");
          });
          peer.on("error", function (err) {
            let error = "Error: " + err;
            swal({
              title: error,
            });
            peer.close();
          });
          peer.on("call", function (call) {
            try {
              swal("WTF??????????????------", call);
              let myStream = window.localStream;
              call.answer(myStream); // Answer the call with an A/V stream.
              call.on("stream", function (stream) {
                // Show stream in some video/canvas element.
                document.getElementById("peerVideo").srcObject = stream;
                document.getElementById("myAudio").srcObject = stream;
                window.remoteStream = stream;
              });
            } catch (error) {
              swal("Failed to get/send stream", error);
            }
          });
        });

        /**
         * Triggered once a connection has been achieved.
         * Defines callbacks to handle incoming data and connection events.
         */
        function ready() {
          conn.on("data", function (data) {
            swal("Data recieved");
          });
          conn.on("close", function () {
            swal("Connection reset. Awaiting connection...");
            conn = null;
          });
        }
      }
      init();
    })();
  },
};
</script>


<style scoped>
</style>