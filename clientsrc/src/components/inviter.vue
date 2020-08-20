<template>
  <div class="inviter text-light mt-2 border">
    <p class="py-0 bg-info text-dark">
      <span id="myId"></span>
    </p>
    <video autoplay="true" id="myVideo" muted controls></video>
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
      <button class="btn btn-block btn-outline-warning" @click="getInfo">WINDOW STREAM</button>
    </div>
    <figure>
      <figcaption>Test Area For Inviter</figcaption>
      <form action>
        <input type="text" v-model="msg" />
        <button type="button" @click="sendMsg">Submit</button>
      </form>
      <audio controls volume="true" autoplay id="peerAudio">
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
      lastId: null,
      msg: "",
    };
  },
  computed: {},
  methods: {
    beginPlay() {
      console.log("in begin play");
      this.$emit("init", true);
    },
    dataIn(data) {
      swal("REC'D: " + data);
    },
    sendMsg() {
      if (true) {
        let msg = this.msg;
        if (window.stream.connection) {
          window.stream.connection.send(msg);
        }
      } else {
        console.log("Connection is closed");
      }
      this.msg = "";
    },
    getInfo() {
      console.log(stream);
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
    console.log("BM-localId-->", window.stream.myId);
  },
  mounted() {
    window.stream.dataIn = this.dataIn;
    window.stream.beginPlay = this.beginPlay;
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

          // document.getElementById("peerAudio").srcObject = stream;
        },
        function (err) {
          alert("Failed to get stream " + err);
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
            debug: 2,
          });
        } else {
          try {
            peer = window.stream.localPeer;
            peer.reconnect();
          } catch (error) {
            console.log(error);
            peer = new Peer(myId, {
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
          // document.getElementById("myId").textContent = `${peer.id}`;
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
            window.stream.connection = c;
            window.stream.beginPlay();
            document.getElementById(
              "peerId"
            ).textContent = `Connected To: ${conn.peer}`;
            ready();
          });

          peer.on("disconnected", function () {
            alert("Connection lost. Please reconnect");

            // Workaround for peer.reconnect deleting previous id
            peer.id = lastPeerId;
            peer._lastServerId = lastPeerId;
            peer.reconnect();
          });

          peer.on("close", function () {
            conn = null;
            alert("Connection destroyed");
          });
          peer.on("error", function (err) {
            let error = "Error: " + err;
            alert(error);
            peer.close();
          });
          peer.on("call", function (call) {
            try {
              let myStream = window.stream.localStream;
              call.answer(myStream); // Answer the call with an A/V stream.
              window.stream.call = call;
              call.on("stream", function (stream) {
                // Show stream in some video/canvas element.
                document.getElementById("peerVideo").srcObject = stream;
                window.stream.remoteStream = stream;

                // document.getElementById(
                //   "peerAudio"
                // ).srcObject = stream.getAudioTracks()[0];
              });
            } catch (error) {
              alert("Failed to get/send stream " + error);
            }
          });
        });

        /**
         * Triggered once a connection has been achieved.
         * Defines callbacks to handle incoming data and connection events.
         */

        function ready() {
          conn.on("data", window.stream.dataIn);
          conn.on("close", function () {
            alert("Connection reset. Awaiting connection...");
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