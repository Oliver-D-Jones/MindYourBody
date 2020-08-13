import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index'
import { api } from "./AxiosService"

Vue.use(Vuex)



export default new Vuex.Store({
  state: {
    trivia:{},
    exercise: {},
    profile: {},
    user:{},
  },
  mutations: {
    setUser(state, profileObject) {
      state.profile = profileObject
    },
    setExercise(state, exerciseObject) {
      state.exercise = exerciseObject
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
    //#region -- BOARDS --
    getBoards({ commit, dispatch }) {
      api.get('boards')
        .then(res => {
          commit('setBoards', res.data)
        })
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
