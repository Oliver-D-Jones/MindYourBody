import { dbContext } from "../db/DbContext"
import { BadRequest } from "../utils/Errors"


class ExercisesService {
  async getAll() {
    return await dbContext.Exercises.find()
  }

  async getRandomExercise(req) {
    let data = await dbContext.Exercises.aggregate([{ $sample: { size: 1 } }])
    if (!data) {
      throw new BadRequest("Invalid ID or you do not own this exercise")
    }
    return data
  }

  async create(rawData) {
    let data = await dbContext.Exercises.create(rawData)
    return data
  }

  async edit(id, update) {
    let data = await dbContext.Exercises.findOneAndUpdate({ _id: id, }, update, { new: true })
    if (!data) {
      throw new BadRequest("Invalid ID or you do not own this exercise");
    }
    return data;
  }

  async delete(id) {
    let data = await dbContext.Exercises.findOneAndRemove({ _id: id });
    if (!data) {
      throw new BadRequest("Invalid ID or you do not own this exercise");
    }
  }

}


export const exercisesService = new ExercisesService()