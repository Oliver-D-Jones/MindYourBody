<template>
  <div class="invitee">
    <div class="border shadow">
      <p>
        My Id:
        <span id="myId"></span>
        <br />
        <!-- <button class="btn btn-sm btn-success" @click="connect">Connect</button>
        <button class="btn btn-sm btn-warning" @click="call">Call</button>-->
        <!-- <button class="btn btn-sm rounded bg-dark text-light" @click="play">></button>
        <button class="btn btn-sm rounded bg-dark text-light" @click="stop">X</button>-->
      </p>
      <video
        autoplay="true"
        id="myVideo"
        class="border"
        style=" max-width: -webkit-fill-available;max-height: -webkit-fill-available;
        width: 120px;height: 100px;"
        muted
      ></video>
      <br />
      <video
        autoplay="true"
        id="peerVideo"
        class="border"
        style="max-width: -webkit-fill-available;max-height: -webkit-fill-available;
        width: 120px;height: 100px;"
      ></video>
      <!-- <button class="btn btn-sm rounded bg-dark text-light" @click="play">></button>
      <button class="btn btn-sm rounded bg-dark text-light" @click="pause">O</button>
      <button class="btn btn-sm rounded bg-dark text-light" @click="stop">X</button>-->
      <p class="border">
        Peer Id:
        <br />
        <span class="text-warning" id="peerId"></span>
      </p>
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
        // document.getElementById("peerId").textContent =
        lastPeerId = peer.id;
      }
      document.getElementById("myId").textContent = peer.id;
      console.log("Peer ID: " + peer.id);

      console.log("before conn", peer_id);
      conn = peer.connect(peer_id, {
        reliable: true,
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

    let call = peer.call(peer_id, window.localStream);
    call.on("stream", function (stream) {
      // `stream` is the MediaStream of the remote peer.
      // Here you'd add it to an HTML video/canvas element.
      console.log("in on stream", stream);
      document.getElementById("peerVideo").srcObject = stream;
    });

    // peer.on("call", function (call) {
    //   getUserMedia(
    //     { video: true, audio: true },
    //     function (stream) {
    //       console.log(stream);
    //       call.answer(stream); // Answer the call with an A/V stream.
    //       call.on("stream", function (remoteStream) {
    //         // Show stream in some video/canvas element.
    //         document.getElementById("peerVideo").srcObject = remoteStream;
    //       });
    //     },
    //     function (err) {
    //       console.log("Failed to get local stream", err);
    //     }
    //   );
    // });
  },
};
</script>


<style scoped>
</style>