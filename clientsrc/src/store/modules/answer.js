import { api } from "../AxiosService"

export default {
  actions: {
    getAnswer({ commit, dispatch, state }) {
      return state.answer
    },
  }
}