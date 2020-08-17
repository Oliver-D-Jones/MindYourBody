import mongoose from "mongoose";
import TriviaSchema from "../models/Trivia";
import ProfileSchema from "../models/Profile";
import PlayerSchema from "../models/Player";
import ExerciseSchema from '../models/Exercise'

class DbContext {
  Trivia = mongoose.model("Trivia", TriviaSchema);
  Profile = mongoose.model("Profile", ProfileSchema);
  Players = mongoose.model("Player", PlayerSchema);
  Exercises = mongoose.model("Exercise", ExerciseSchema);
}

export const dbContext = new DbContext();
