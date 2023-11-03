import mongoose from "mongoose";
const { Schema } = mongoose;

const clientSchema = new Schema({
    company: String,
    enabled: Boolean
})

export const Client = mongoose.model('Client', clientSchema);