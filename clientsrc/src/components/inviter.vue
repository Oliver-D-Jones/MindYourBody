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
    </div>
  </div>
</template>


<script>
export default {
  name: "inviter",
  data() {
    return {
      localPeer: null,
      conn: null,
    };
  },
  computed: {},
  methods: {},
  components: {},
  beforeDestroy() {
    localStream = null;
    this.conn.close();
    this.localPeer.disconnect();
  },
  created() {
    let video = document.getElementById("myVideo");
    let peer = {};
    this.localPeer = peer;
    let conn = {};
    this.conn = conn;

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
        console.log("Failed to get stream", err);
      }
    );

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
        lastPeerId = peer.id;
      }
      document.getElementById("myId").textContent = `${peer.id}`;
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
      document.getElementById("peerId").textContent = `${conn.peer}`;

      // status.innerHTML = "Connected";
      ready();
    });

    peer.on("call", function (call) {
      try {
        call.answer(window.localStream); // Answer the call with an A/V stream.
        call.on("stream", function (remoteStream) {
          // Show stream in some video/canvas element.
          document.getElementById("peerVideo").srcObject = remoteStream;
          console.log(localStream, remoteStream);
        });
      } catch (error) {
        console.log("Failed to get/send stream", error);
      }
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