<template>
  <div class="invitee">
    <div class="row">
      <div class="col-12">
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
  created() {
    // Call a peer, providing our mediaStream
    let lastPeerId = null;
    let conn = null;
    let peer_id = this.$store.state.stream.peer.id;
    let peer = new Peer(null, {
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
      console.log("Peer ID: " + peer.id);

      console.log("before conn", peer_id);
      conn = peer.connect(peer_id, {
        reliable: true,
      });

      let call = peer.call(peer_id, window.localStream);
      call.on("stream", function (stream) {
        // `stream` is the MediaStream of the remote peer.
        // Here you'd add it to an HTML video/canvas element.
        console.log("in on stream", stream);
        console.log("conn Id", conn.peer);
        document.getElementById(
          "peerId"
        ).textContent = `Connected To: ${conn.peer}`;
        document.getElementById("peerVideo").srcObject = stream;
      });
    });

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then(function (stream) {
          window.localStream = stream;
          document.getElementById("myVideo").srcObject = stream;
        });
    }
  },
};
</script>


<style scoped>
</style>