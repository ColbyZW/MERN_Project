import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    name: String,
    email: String, 
    _id: String,
    photo: {type: Schema.Types.ObjectId, ref: 'Photo'},
    createdAt: {type: Schema.Types.Date, default: Date.now},
    lancer: {type: Schema.Types.ObjectId, ref: 'Lancer'},
    client: {type: Schema.Types.ObjectId, ref: "Client"},
    fullyRegistered: Boolean
})

export const User = mongoose.model('User', userSchema)