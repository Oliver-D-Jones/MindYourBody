import mongoose from "mongoose"
let Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId

const Player = new Schema({
    name: { type: String, required: true },
    profileId: { type: ObjectId, ref: "Profile" },
    points: { type: Number, required: false },
    streak: { type: Number, required: false },
    megaStreak: { type: Number, required: false },
    categoryStats: { type: Object, required: false },
}, { timestamps: true, toJSON: { virtuals: true } })


export default Player;