import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index'
import { api } from "./AxiosService"

Vue.use(Vuex)



export default new Vuex.Store({
  state: {
    trivia: {},
    exercise: {},
    profile: {},
    leaders: [],
    user: {},
    currentPlayer: {
      categoryStats: []
    },
    stream: { class: false, user: { id: null }, peer: { id: null } },
    level: null,
    subject: null,
    answer: null,
    categoryLibrary: [
      { id: 9, name: "General Knowledge" },
      { id: 10, name: "Books" },
      { id: 11, name: "Film" },
      { id: 12, name: "Music" },
      { id: 13, name: "Musicals & Theatres" },
      { id: 14, name: "Television" },
      { id: 15, name: "Video Games" },
      { id: 16, name: "Board Games" },
      { id: 17, name: "Science & Nature" },
      { id: 18, name: "Computers" },
      { id: 19, name: "Mathematics" },
      { id: 20, name: "Mythology" },
      { id: 21, name: "Sports" },
      { id: 22, name: "Geography" },
      { id: 23, name: "History" },
      { id: 24, name: "Politics" },
      { id: 25, name: "Art" },
      { id: 26, name: "Celebrities" },
      { id: 27, name: "Animals" },
      { id: 28, name: "Vehicles" },
      { id: 29, name: "Comics" },
      { id: 30, name: "Gadgets" },
      { id: 31, name: "Japanese Anime & Manga" },
      { id: 32, name: "Cartoon & Animations" }],
    triviaToken: "",
  },
  mutations: {
    clearStream(state) {
      state.stream.class = false;
      state.stream.user.id = null;
      state.stream.peer.id = null;
    }
    ,
    setProfile(state, profileObject) {
      state.profile = profileObject
    },
    setExercise(state, exerciseObject) {
      state.exercise = exerciseObject
    },
    setSubject(state, subject) {
      state.subject = subject
    },
    setLevel(state, level) {
      state.level = level
    },
    setTrivia(state, trivia) {
      state.trivia = trivia;
    },
    setLeaders(state, leaders) {
      state.leaders = leaders;
    },
    setCurrentPlayer(state, currentPlayer) {
      state.currentPlayer = currentPlayer;
    },
    setTriviaToken(state, token) {
      state.trivia.token = token;
    },
    clearTrivaToken(state) {
      state.triviaToken = "";
    },

  },
  actions: {
    async getExercise({ commit, dispatch }) {
      try {
        let res = await api.get("/exercises/random")
        commit("setExercise", res.data)
      } catch (err) {
        console.error(err)
      }
    },

    //#region -- AUTH STUFF --
    setBearer({ }, bearer) {
      api.defaults.headers.authorization = bearer;
    },
    resetBearer() {
      api.defaults.headers.authorization = "";
    },
    async getProfile({ commit, dispatch, state }) {
      try {
        let res = await api.get("/profile")
        await commit("setProfile", res.data)
        dispatch("getCurrentPlayer")
      } catch (err) {
        console.error(err)
      }
    },
    async getCurrentPlayer({ commit, dispatch, state }) {
      try {
        let res = await api.get("players/" + state.profile.id)
        commit("setCurrentPlayer", res.data)
      } catch (err) {
        dispatch("newPlayer", {
          id: state.profile.id,
          name: state.profile.name
        })
        console.error(err)
      }
    },
    getAnswer({ commit, dispatch, state }) {
      return state.answer
    },
    getTrivia({ commit, dispatch, state }) {
      return state.trivia
    },
    getLeaders({ commit, dispatch, state }) {
      return state.leaders
    },

    //fetches players with top 10 scores from players db for adding to leader board
    async loadLeaders({ commit, dispatch, state }) {
      let res = await api.get("players/" + "gettop")
      console.log("hello from loadLeaders")
      commit("setLeaders", res.data)
    },

    setSubject({ commit, dispatch, state }, data) {
      commit("setSubject", data)
    },

    //checks if player already exists and, if not, passes data to new player constructor
    async checkPlayer({ commit, dispatch, state }, data) {
      try {
        let res = await api.get("players/" + data.data.id)
        dispatch('getPoints', data)
      } catch (err) {
        dispatch("newPlayer", data)
        console.error(err)
      }
    },
    //creates new player in player db from combination of profile info and default settings
    async newPlayer({ commit, dispatch, state }, data) {
      console.log("hello from newPlayer")
      debugger
      try {
        let res = await api.post("players", {
          name: data.name,
          points: 0,
          profileId: data.id,
          previousDate: 0,
          recentDate: 0,
          timeStreakCount: 1,
          streak: data.streak
        })
        commit("setCurrentPlayer", res.data)
      } catch (err) {
        console.error(err)
      }
    },

    //retrieves points stored in profile and passes along points just earned
    async getPoints({ commit, dispatch, state }, data) {
      console.log("hello from getPoints")
      try {
        let res = await api.get("players/" + data.id)
        dispatch("updatePoints", {
          id: data.id,
          oldPoints: res.data.points,
          newPoints: data.points,
          //streak: data.streak
        })
      } catch (err) {
        console.error(err)
      }
    },
    //adds all points awarded for question and streak if streak earned
    async updatePoints({ commit, dispatch, state }, data) {
      console.log("hello from updatePoints")
      try {
        let res = await api.put("players/" + data.id, {
          points: (data.oldPoints + data.newPoints)
        })
        dispatch("loadLeaders")
      } catch (err) {
        console.error(err)
      }
    },
    //sets the number of days in a row player has played
    async updateStreak({ commit, dispatch, state }, data) {
      try {
        let res = await api.put("players/" + data.id, {
          timeStreakCount: data.number,
        })
        dispatch("getCurrentPlayer")
      } catch (err) {
        console.error(err)
      }
    },
    //sets most recent play date to current date, moves previous recent play date to "previous"
    async setDates({ commit, dispatch, state }, data) {
      try {
        let res = await api.put("players/" + data.id, {
          previousDate: state.currentPlayer.recentDate,
          recentDate: data.date
          //for test purposes:
          //previousDate: 1593720150000,
          //recentDate: 1593979350000
        })
        dispatch("getCurrentPlayer")
        //dispatch("checkTimeStreak", data)
        console.log(state.currentPlayer)
      } catch (err) {
        console.error(err)
      }
    },
    setLevel({ commit, dispatch, state }, data) {
      commit("setLevel", data)
    },
  }
})
