import { api } from "../AxiosService"

export default {
  actions: {
    getTrivia({ commit, dispatch, state }) {
      return state.trivia
    },
  }
}