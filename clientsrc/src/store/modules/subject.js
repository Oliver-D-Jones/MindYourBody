import { api } from "../AxiosService"

export default {
  actions: {
    setSubject({ commit, dispatch, state }, data) {
      commit("setSubject", data)
    },
  }
}