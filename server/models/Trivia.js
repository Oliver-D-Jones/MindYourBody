import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Trivia = new Schema(
  {
    category: { type: String, required: true },
    type: { type: String, required: true },
    difficulty: { type: String, required: true },
    question: { type: String, required: true },
    correct_answer: { type: String || Number, required: true },
    incorrect_answers: [{ type: String || Number, required: true }]
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default Trivia;


// "response_code": 0,
// https://opentdb.com/api.php?amount=1&category=15&difficulty=easy&type=boolean
// https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple