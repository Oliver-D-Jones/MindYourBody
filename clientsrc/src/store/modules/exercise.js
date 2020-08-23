import { api } from "../AxiosService"

export default {
  actions: {
    async getExercise({ commit, dispatch }) {
      try {
        let res = await api.get("/exercises/random")
        commit("setExercise", res.data[0])
        return res.data[0];
      } catch (err) {
        console.error(err)
      }
    },
  }
}