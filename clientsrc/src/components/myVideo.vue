<template>
  <div class="myVideo bg-dark text-info">
    <div class="col-12">
      <p v-if="playerClass == 'inviter'">
        My Link:
        <br />
        <textarea
          type="text"
          :value="link"
          readonly
          class="bg-dark text-info"
          style="width: -webkit-fill-available;height: auto;
              border: none;overflow: scroll;text-align: center;"
        />
        <br />My Room:
        <br />
        <input
          type="text"
          :value="room"
          readonly
          class="bg-dark text-info"
          style="width: -webkit-fill-available;height: auto;
               border: none; text-align: center;"
        />
      </p>
    </div>
    <div class="col-12">
      <h4 class="my-0">
        <span
          class="badge badge-dark text-light text-truncate"
          style="width: -webkit-fill-available;"
        >{{me}}</span>
      </h4>
    </div>
    <div class="col-12 d-flex controls" style="justify-content: center;">
      <svg
        width="1.3rem"
        height="1.3rem"
        @click="toggleVideoPlay('myVideo')"
        viewBox="0 0 16 16"
        class="col-2 bi bi-camera-video-off"
        fill="blue"
        xmlns="http://www.w3.org/2000/svg"
        v-if="videoStream"
      >
        <path
          fill-rule="evenodd"
          d="M10.961 12.365a1.99 1.99 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272l.714 1H9.5a1 1 0 0 1 1 1v6a1 1 0 0 1-.144.518l.605.847zM1.428 4.18A.999.999 0 0 0 1 5v6a1 1 0 0 0 1 1h5.014l.714 1H2a2 2 0 0 1-2-2V5c0-.675.334-1.272.847-1.634l.58.814zM15 11.73l-3.5-1.555v-4.35L15 4.269v7.462zm-4.407 3.56l-10-14 .814-.58 10 14-.814.58z"
        />
      </svg>

      <svg
        width="1.3rem"
        height="1.3rem"
        @click="toggleVideoPlay('myVideo')"
        viewBox="0 0 16 16"
        class="col-2 bi bi-camera-video"
        fill="blue"
        xmlns="http://www.w3.org/2000/svg"
        v-else
      >
        <path
          fill-rule="evenodd"
          d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175l3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z"
        />
      </svg>

      <svg
        width="1.3rem"
        height="1.3rem"
        @click="toggleAudioMuted('myVideo')"
        viewBox="0 0 16 16"
        class="col-2 bi bi-mic-mute"
        fill="blue"
        v-if="audioStream"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M12.734 9.613A4.995 4.995 0 0 0 13 8V7a.5.5 0 0 0-1 0v1c0 .274-.027.54-.08.799l.814.814zm-2.522 1.72A4 4 0 0 1 4 8V7a.5.5 0 0 0-1 0v1a5 5 0 0 0 4.5 4.975V15h-3a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-3v-2.025a4.973 4.973 0 0 0 2.43-.923l-.718-.719zM11 7.88V3a3 3 0 0 0-5.842-.963l.845.845A2 2 0 0 1 10 3v3.879l1 1zM8.738 9.86l.748.748A3 3 0 0 1 5 8V6.121l1 1V8a2 2 0 0 0 2.738 1.86zm4.908 3.494l-12-12 .708-.708 12 12-.708.707z"
        />
      </svg>
      <svg
        width="1.3rem"
        height="1.3rem"
        @click="toggleAudioMuted('myVideo')"
        viewBox="0 0 16 16"
        class="col-2 bi bi-mic"
        fill="blue"
        v-else
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"
        />
        <path
          fill-rule="evenodd"
          d="M10 8V3a2 2 0 1 0-4 0v5a2 2 0 1 0 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3z"
        />
      </svg>
      <svg
        width="1.3rem"
        height="1.3rem"
        viewBox="0 0 16 16"
        role="img"
        class="col-2 bi bi-pip"
        fill="blue"
        @click="togglePIP('myVideo')"
        v-if="!PIP"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5v-9zM1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z"
        />
        <path
          d="M8 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-5a.5.5 0 0 1-.5-.5v-3z"
        />
      </svg>
      <svg
        width="1.3rem"
        height="1.3rem"
        viewBox="0 0 16 16"
        class="col-2 bi bi-window"
        fill="blue"
        @click="togglePIP('myVideo')"
        v-else
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M14 2H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1zM2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z"
        />
        <path fill-rule="evenodd" d="M15 6H1V5h14v1z" />
        <path
          d="M3 3.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm1.5 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0zm1.5 0a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z"
        />
      </svg>
      <svg
        width="1.3rem"
        height="1.3rem"
        viewBox="0 0 16 16"
        class="col-2 bi bi-fullscreen"
        fill="blue"
        @click="toggleFullScreen('myVideo')"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"
        />
      </svg>
      <svg
        width="1.3em"
        height="1.3em"
        viewBox="0 0 16 16"
        class="col-2 bi bi-camera-reels"
        fill="blue"
        @click="toggleCamera"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M0 8a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 7.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 16H2a2 2 0 0 1-2-2V8zm11.5 5.175l3.5 1.556V7.269l-3.5 1.556v4.35zM2 7a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H2z"
        />
        <path
          fill-rule="evenodd"
          d="M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
        />
        <path
          fill-rule="evenodd"
          d="M9 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
        />
      </svg>
    </div>
    <div class style="justify-content: center;">
      <video
        autoplay="true"
        id="myVideo"
        class="col-12 mt-0 pt-0"
        muted
        poster="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.giphy.com%2Fmedia%2Fi3pHUtmHiLd28%2Fgiphy.gif&f=1&nofb=1"
      ></video>
    </div>
  </div>
</template>


<script>
export default {
  name: "myVideo",
  data() {
    return {
      videoStream: true,
      audioStream: true,
      PIP: false,
      me: this.$auth.user.name,
      link: window.stream.myLink,
      room: window.stream.myId,
      playerClass: window.stream.class,
      shouldFaceUser: true,
    };
  },
  computed: {},
  methods: {
    capture() {
      let defaultsOpts = { audio: true, video: true };
      defaultsOpts.video = {
        facingMode: this.shouldFaceUser ? "user" : "user",
      };
      navigator.mediaDevices
        .getUserMedia(defaultsOpts)
        .then(function (_stream) {
          console.log(_stream,"\n",stream.localStream);
          stream.localStream = _stream;
          stream.localPeer.call(stream.connection.peer,stream.localStream)
          document.getElementById("myVideo").srcObject = stream.localStream;
          document.getElementById("myVideo").play();
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    toggleCamera() {
      if (stream.localStream == null) return;
      // we need to flip, stop everything
      let supports = navigator.mediaDevices.getSupportedConstraints();
      if (!supports["facingMode"]) {
        swal("Your Device Doesn't Support This Feature.", { timer: 2000 });
        return;
      }
      // stream.localStream.getTracks().forEach((t) => {
      //   t.stop();
      // });
      // toggle / flip
      this.shouldFaceUser = !this.shouldFaceUser;
      // this.capture();
    },
    toggleFullScreen() {
      if (!document.fullscreenElement) {
        document.getElementById("myVideo").requestFullscreen();
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    },
    toggleVideoPlay(id) {
      stream.localStream.getVideoTracks()[0].enabled = !stream.localStream.getVideoTracks()[0]
        .enabled;
      this.videoStream = !this.videoStream;
    },
    toggleAudioMuted(id) {
      stream.localStream.getAudioTracks()[0].enabled = !stream.localStream.getAudioTracks()[0]
        .enabled;
      this.audioStream = !this.audioStream;
    },
    togglePIP(id) {
      let videoElement = document.getElementById(id);
      if (
        document.pictureInPictureEnabled &&
        !videoElement.disablePictureInPicture
      ) {
        try {
          if (document.pictureInPictureElement) {
            document.exitPictureInPicture();
            this.PIP = false;
          } else {
            this.PIP = true;
          }
          videoElement.requestPictureInPicture();
        } catch (err) {
          console.error(err);
        }
      }
    },
  },
  beforeDestroy() {
  },
  beforeMount() {},
  components: {},
};
</script>


<style scoped>
</style>