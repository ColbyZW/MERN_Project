import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema({
    messageContents: String,
    createdAt: {type: Schema.Types.Date, default: Date.now},
    updatedAt: {type: Schema.Types.Date, default: Date.now}
})

export const Message = mongoose.model('Message', messageSchema);