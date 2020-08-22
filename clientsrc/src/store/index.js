import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index'
import { api } from "./AxiosService"
import answer from "./modules/answer"
import exercise from "./modules/exercise"
import leaders from "./modules/leaders"
import level from "./modules/level"
import subject from "./modules/subject"
import trivia from "./modules/trivia"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    trivia: {},
    exercise: {},
    profile: {},
    leaders: [],
    user: {},
    currentPlayer: {},
    stream: { class: false, user: { id: null }, peer: { id: null } },
    level: null,
    subject: null,
    answer: null,
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
    inviteeExercise({ commit }, data) {
      commit("setExercise", data)
    },
    inviteeTrivia({ commit }, data) {
      commit("setTrivia", data)
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

    //retrieves points stored in profile and passes along points just earned
    async getPoints({ commit, dispatch, state }, data) {
      console.log("hello from getPoints")
      try {
        let res = await api.get("players/" + data.id)
        dispatch("updatePoints", {
          id: data.id,
          oldPoints: res.data.points,
          newPoints: data.points,
          streak: data.streak,
          megaStreak: data.megaStreak,
          categoryStats: [{
            category: data.category,
            correct: data.correct,
            attempted: data.attempted
          }]
        })
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
      try {
        let res = await api.post("players", {
          name: data.name,
          points: 0,
          profileId: data.id,
          previousDate: 0,
          recentDate: 0,
          timeStreakCount: 1,
          streak: 0,
          megaStreak: 0,
          categoryStats: []
        })
        commit("setCurrentPlayer", res.data)
      } catch (err) {
        console.error(err)
      }
    },

    //adds all points awarded for question and streak if streak earned
    async updatePoints({ commit, dispatch, state }, data) {
      console.log("hello from updatePoints")
      try {
        let res = await api.put("players/" + data.id, {
          points: (data.oldPoints + data.newPoints),
          streak: data.streak,
          megaStreak: data.megaStreak,
        })
        dispatch("loadLeaders")
        dispatch("getCurrentPlayer")
      } catch (err) {
        console.error(err)
      }
    },

    //updates the player object and profile modal with latest game stats
    async updateCategoryStats({ commit, dispatch, state }, data) {
      try {
        let res = await api.put("players/" + data.profileId, { categoryStats: data.categoryStats })
        dispatch("getCurrentPlayer")
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
  },
  modules: {
    answer,
    exercise,
    leaders,
    level,
    subject,
    trivia
  }
})
