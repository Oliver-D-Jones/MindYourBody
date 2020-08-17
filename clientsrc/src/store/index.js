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
    currentPlayer: {},
    stream: { user: { id: null }, peer: { id: null } },
    level: null,
    subject: null,
    answer: null
  },
  mutations: {
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
    }

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
        console.log(state.profile.id)
        await commit("setProfile", res.data)
        dispatch("getCurrentPlayer")
        console.log(state.profile.id)
      } catch (err) {
        console.error(err)
      }
    },
    async getCurrentPlayer({ commit, dispatch, state }) {
      try {
        console.log("zippee", state.profile.id)
        let res = await api.get("players/" + state.profile.id)
        commit("setCurrentPlayer", res.data)
      } catch (err) {
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
    async loadLeaders({ commit, dispatch, state }) {
      let res = await api.get("players/" + "gettop")
      console.log("hello from loadLeaders")
      commit("setLeaders", res.data)
    },

    setSubject({ commit, dispatch, state }, data) {
      commit("setSubject", data)
    },

    async checkPlayer({ commit, dispatch, state }, data) {
      try {
        let res = await api.get("players/" + data.data.id)
        dispatch('getPoints', data)
      } catch (err) {
        dispatch("newPlayer", data)
        console.error(err)
      }
    },

    async newPlayer({ commit, dispatch, state }, data) {
      console.log("hello from newPlayer")
      try {
        let res = await api.post("players", {
          name: data.data.name,
          points: 0,
          profileId: data.data.id
        })
        dispatch('getPoints', data)
      } catch (err) {
        console.error(err)
      }
    },

    async getPoints({ commit, dispatch, state }, data) {
      console.log("hello from getPoints")
      try {
        let res = await api.get("players/" + data.data.id)
        dispatch("updatePoints", {
          id: data.data.id,
          oldPoints: res.data.points,
          newPoints: data.points
        })
      } catch (err) {
        console.error(err)
      }
    },
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
    setLevel({ commit, dispatch, state }, data) {
      commit("setLevel", data)
    },
  }
})
