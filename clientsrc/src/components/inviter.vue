<template>
  <div class="inviter">
    <div class="row">
      <video
        autoplay="true"
        id="myVideo"
        class="col-2"
        muted
        controls
      ></video>
      <video
        autoplay="true"
        id="peerVideo"
        class="col-2"
        poster="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.giphy.com%2Fmedia%2Fi3pHUtmHiLd28%2Fgiphy.gif&f=1&nofb=1"
        controls
      ></video>
    </div>
  </div>
</template>


<script>
export default {
  name: "inviter",
  data() {
    return {
      localStream: window.localStream,
      localPeer: null,
    };
  },
  computed: {},
  methods: {},
  components: {},
  created() {
    let video = document.getElementById("myVideo");
    let peer = {};
    this.localPeer = peer;
    let conn = {};

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(function (stream) {
          window.localStream = stream;
          document.getElementById("myVideo").srcObject = stream;
        });
    }

    // Create own peer object with connection to shared PeerJS server
    let lastPeerId = null;

    let user = this.$store.state.stream.user.id;
    console.log(user);
    peer = new Peer(user, {
      debug: 2,
    });

    peer.on("open", function (id) {
      // Workaround for peer.reconnect deleting previous id
      if (peer.id === null) {
        console.log("Received null id from peer open");
        peer.id = lastPeerId;
      } else {
        console.log("receieved peer.id");
        // document.getElementById("peerId").textContent =
        lastPeerId = peer.id;
      }
      document.getElementById("myId").textContent = peer.id;
      console.log("Peer ID: " + peer.id);
    });

    peer.on("connection", function (c) {
      // Allow only a single connection
      if (conn && conn.open) {
        c.on("open", function () {
          c.send("Already connected to another client");
          setTimeout(function () {
            c.close();
          }, 500);
        });
        return;
      }

      conn = c;
      console.log("Connected to: " + conn.peer);
      document.getElementById("peerId").textContent = conn.peer;

      // status.innerHTML = "Connected";
      ready();
    });
    let getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia;

    peer.on("call", function (call) {
      getUserMedia(
        { video: true, audio: true },
        function (stream) {
          console.log(stream);
          call.answer(stream); // Answer the call with an A/V stream.
          call.on("stream", function (remoteStream) {
            // Show stream in some video/canvas element.
            document.getElementById("peerVideo").srcObject = remoteStream;
          });
        },
        function (err) {
          console.log("Failed to get local stream", err);
        }
      );
    });

    peer.on("disconnected", function () {
      // status_1.innerHTML = "Connection lost. Please reconnect";
      console.log("Connection lost. Please reconnect");

      // Workaround for peer.reconnect deleting previous id
      peer.id = lastPeerId;
      peer._lastServerId = lastPeerId;
      peer.reconnect();
    });
    peer.on("close", function () {
      conn = null;
      // status_1.innerHTML = "Connection destroyed. Please refresh";
      console.log("Connection destroyed");
    });
    peer.on("error", function (err) {
      console.log(err);
      // alert("" + err);
      let error = "" + err;
      swal({
        title: error,
      });
      peer.close();
    });
    function ready() {
      conn.on("data", function (data) {
        // console.log("Data recieved");
        // document.getElementById("msgIn").textContent = data;
        console.log(data, typeof data);
        // document.getElementById("myPeer").srcObject = data;
      });
      conn.on("close", function () {
        // status.innerHTML = "Connection reset<br>Awaiting connection...";
        conn = "";
      });
    }
  },
};
</script>


<style scoped>
</style>