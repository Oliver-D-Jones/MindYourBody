import mongoose from "mongoose"
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId

const Exercise = new Schema({
  exercise: { type: String, required: false },
  equipment: { type: String, required: false },
  type: { type: String, required: false },
  major_muscle: { type: String, required: false },
  minor_muscle: { type: String, required: false },
  example: { type: String, required: false },
  notes: { type: String, required: false },
  modifications: { type: String, required: false },
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