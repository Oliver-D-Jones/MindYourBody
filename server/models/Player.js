import mongoose from "mongoose"
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId

const Player = new Schema({
    name: { type: String, required: true },
    points: { type: Number, required: false },
    profileId: { type: ObjectId, ref: "Profile" }
}, { timestamps: true, toJSON: { virtuals: true } })


export default Player;