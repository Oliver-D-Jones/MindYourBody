import { dbContext } from "../db/DbContext";
import { BadRequest } from "../utils/Errors";

class TriviaService {
  async find(query = {}) {
    let trivias = await dbContext.Trivia.find(query);
    return trivias;
  }
  async findById(id) {
    let trivia = await dbContext.Trivia.findById(id);
    if (!trivia) {
      throw new BadRequest("Invalid Id");
    }
    return trivia;
  }
}

export const triviaService = new TriviaService();