import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    name: String,
    email: String, 
    userId: String,
    createdAt: {type: Schema.Types.Date, default: Date.now},
    lancer: {type: Schema.Types.ObjectId, ref: 'Lancer'},
    client: {type: Schema.Types.ObjectId, ref: "Client"}
})

export const User = mongoose.model('User', userSchema)