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
    user: {},
    level: {},
    subject: {},
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
    setTrivia(state,trivia){
      state.trivia = trivia;
    }

  },
  actions: {
    async getExercise({ commit, dispatch }) {
      try {
        let res = await api.get("/exercises/random")
        console.log("got an exercise", res.data)
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
    //#region -- BOARDS --
    getBoards({ commit, dispatch }) {
      api.get('boards')
        .then(res => {
          commit('setBoards', res.data)
        })
    },

    setSubject({ commit, dispatch, state }, data) {
      commit("setSubject", data)
      console.log(state.subject)
    },
    setLevel({ commit, dispatch, state }, data) {
      commit("setLevel", data)
      console.log(state.level)
    },
    addBoard({ commit, dispatch }, boardData) {
      api.post('boards', boardData)
        .then(serverBoard => {
          dispatch('getBoards')
        })
    }
    //#endregion



    //#endregion
    //#endregion


    // getQuiz({},id){
    //   api.get( `https://opentdb.com/api.php?amount=1&category=${id}&difficulty=medium&type=multiple`)
    //   .then(res=>{
    //     return res;
    //   })
    // },

  }
})
