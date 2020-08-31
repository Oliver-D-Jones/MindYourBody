import { api } from "../AxiosService"

export default {
  actions: {
    //fetches players with top 10 scores from players db for adding to leader board
    async loadLeaders({ commit, dispatch, state }) {
      let res = await api.get("players/" + "gettop")
      commit("setLeaders", res.data)
    },
    getLeaders({ commit, dispatch, state }) {
      return state.leaders
    },
  }
}