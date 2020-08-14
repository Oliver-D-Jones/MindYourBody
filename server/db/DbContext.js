import mongoose from "mongoose";
import TriviaSchema from "../models/Trivia";
import ProfileSchema from "../models/Profile";
import ExerciseSchema from '../models/Exercise'
class DbContext {
  Trivia = mongoose.model("Trivia", TriviaSchema);
  Profile = mongoose.model("Profile", ProfileSchema);
  Exercises = mongoose.model("Exercise", ExerciseSchema);
  Leaders = mongoose.model("leaders", ProfileSchema)
}

export const dbContext = new DbContext();
