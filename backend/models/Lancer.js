import mongoose from "mongoose";
const { Schema } = mongoose;

const lancerSchema = new Schema({
    company: String,
    enabled: Boolean
})

export const Lancer = mongoose.model('Lancer', lancerSchema);