import { api } from "../AxiosService"

export default {
  actions: {
    setLevel({ commit, dispatch, state }, data) {
      commit("setLevel", data)
    },
  }
}