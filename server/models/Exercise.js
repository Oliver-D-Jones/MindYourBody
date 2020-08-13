import mongoose from "mongoose"
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId

const Exercise = new Schema({
  title: { type: String, required: false },
  example: { type: String, required: false },
  notes: { type: String, required: false },
  reps: { type: Number, required: false },
  time: { type: Number, required: false }
}, { timestamps: true, toJSON: { virtuals: true } })


//CASCADE ON DELETE
// Board.pre('findOneAndRemove', function (next) {
//   //lets find all the lists and remove them
//   Promise.all([
//     dbContext.List.deleteMany({ boardId: this._conditions._id })
//   ])
//     .then(() => next())
//     .catch(err => next(err))
// })

export default Exercise