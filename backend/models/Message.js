import mongoose from "mongoose";
const { Schema } = mongoose;

const messageSchema = new Schema({
    messageContents: Schema.Types.String,
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    photos: [{type: Schema.Types.ObjectId, ref: 'Photo'}],
    createdAt: {type: Schema.Types.Date, default: Date.now},
    updatedAt: {type: Schema.Types.Date, default: Date.now}
})

export const Message = mongoose.model('Message', messageSchema);