export default {
    gifs: [
        "https://cdn.dribbble.com/users/706471/screenshots/3660298/brain-workout-2.gif",
        "https://exploringyourmind.com/wp-content/uploads/2018/02/gif-of-a-brain-and-its-synapses.gif",
        "https://www.holisticwebpresence.com/wp-content/uploads/2013/12/Web-Presence-Brain-Training.gif",
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcdn.dribbble.com%2Fusers%2F428994%2Fscreenshots%2F4898847%2Fbraintraining_dribble.gif&f=1&nofb=1",
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.assignmentexpert.com%2Fblog%2Fwp-content%2Fuploads%2F2015%2F05%2F240_Logo-EMM.gif&f=1&nofb=1",
        "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.prana-yoga-zentrum.de%2Fimages%2F57.gif&f=1&nofb=1",
        "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fneurosynthesis.files.wordpress.com%2F2008%2F10%2Fsmall_brain_animated.gif&f=1&nofb=1",
        "https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.media.inaf.it%2Fwp-content%2Fuploads%2F2017%2F11%2Fprev-nasa-small.gif&f=1&nofb=1",
        "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.giphy.com%2Fmedia%2Fl0HU5526qfCzI25Q4%2Fgiphy.gif&f=1&nofb=1",
        "https://upload.wikimedia.org/wikipedia/commons/a/ae/Inferior_frontal_gyrus_animation_small.gif",
    ],
    getGif: function(){
        return this.gifs[Math.floor(Math.random()*this.gifs.length)]
    }
}