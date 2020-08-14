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
      state.leaders = leaders
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
    async getProfile({ commit }) {
      try {
        let res = await api.get("/profile")
        commit("setProfile", res.data)
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
    setSubject({ commit, dispatch, state }, data) {
      commit("setSubject", data)
    },
    setLeaders({ commit, dispatch, state }, data) {
      if (state.leaders.length < 10) {
        api.post("leaders", data).then(res => {
          commit("setLeaders", res.data)
          state.leaders.sort((p1, p2) => p2.points - p1.points)
        })
      } else {
        if (data.points > state.leaders[9].points) {
          api.post("leaders", data).then(res => {
            commit("setLeaders", res.data)
          })
        }
      }
    },
    async addPoints({ commit, dispatch, state }, data) {
      try {
        let res = await api.put('/profile/' + data.id, data).then(res => {
          dispatch("getProfile", data.id)
        })
        commit("setProfile")
        dispatch("setLeaders", data)
      } catch (error) {
        console.error(error)
      }
    },
    setLevel({ commit, dispatch, state }, data) {
      commit("setLevel", data)
    },
  }
})
