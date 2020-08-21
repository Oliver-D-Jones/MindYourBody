import { api } from "../AxiosService"

export default {
  actions: {
    async getExercise({ commit, dispatch }) {
      try {
        let res = await api.get("/exercises/random")
        commit("setExercise", res.data)
      } catch (err) {
        console.error(err)
      }
    },
  }
}