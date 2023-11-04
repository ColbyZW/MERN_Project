import mongoose from "mongoose";
const { Schema } = mongoose;

const photoSchema = new Schema({
    filename: String,
    url: String,
    createdAt: {type: Schema.Types.Date, default: Date.now},
    updatedAt: {type: Schema.Types.Date, default: Date.now}
})

export const Photo = mongoose.model('Photo', photoSchema);