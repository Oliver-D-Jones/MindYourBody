<template>
  <div class="invitee">
    <div class="row border">
      <div class="col-12 border">
        <h4>
          Invitee
          <span id="myId"></span>
          <span id="peerId"></span>
        </h4>
      </div>
      <video autoplay="true" id="myVideo" class="col-2" muted controls></video>
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
  name: "invitee",
  data() {
    return {};
  },
  computed: {},
  methods: {},
  components: {},
  beforeDestroy() {
    swal("ARE YOU SURE???");
    localStream = null;
  },
  created() {
    // Call a peer, providing our mediaStream
    let lastPeerId = null;
    let conn = null;
    let peer = null;
    let peer_id = this.$store.state.stream.peer.id;
    let myId = this.$store.state.stream.user.id;

    peer = new Peer(myId, {
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
      document.getElementById("myId").textContent = `My Id: ${peer.id}`;

      peer.on("connection", function (c) {
        // Disallow incoming connections
        c.on("open", function () {
          c.send("Sender does not accept incoming connections");
          setTimeout(function () {
            c.close();
          }, 500);
        });
      });
      peer.on("disconnected", function () {
        swal("Connection lost. Please reconnect").then((res) => {
          peer.id = this.$store.state.stream.user.id;
          peer._lastServerId = this.$store.state.stream.user.id;
          peer.reconnect();
          swal.close();
        });
        // Workaround for peer.reconnect deleting previous id
      });
      peer.on("close", function () {
        conn = null;
        swal("Connection destroyed. Please refresh");
        console.log("Connection destroyed");
      });
      peer.on("error", function (err) {
        console.log(err);
        swal("" + err);
      });

      conn = peer.connect(peer_id, {
        reliable: true,
      });

      conn.on("open", function () {
        // swal("Connected to: " + conn.peer);
        console.log("Connected to: " + conn.peer);
        document.getElementById(
          "peerId"
        ).textContent = `Connected To: ${conn.peer}`;
      });

      conn.on("data", function (data) {
        //add functionality for sending data;
        swal(data);
      });
      conn.on("close", function () {
        swal("Connection closed");
      });

      let getUserMedia =
        navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

      getUserMedia({ video: true, audio: true }, function (stream) {
        window.localStream = stream;
        document.getElementById("myVideo").srcObject = stream;

        let call = peer.call(peer_id, window.localStream);
        call.on("stream", function (remoteStream) {
          // `stream` is the MediaStream of the remote peer.
          // Here you'd add it to an HTML video/canvas element.
          console.log(remoteStream);
          document.getElementById("peerVideo").srcObject = remoteStream;
        });
      });
    });
  },
};
</script>


<style scoped>
</style>