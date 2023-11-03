import mongoose from "mongoose";
const { Schema } = mongoose;

const projectMessageSchema = new Schema({
    project: {type: Schema.Types.ObjectId, ref: 'Project'},
    messages: [{type: Schema.Types.ObjectId, ref: 'Message'}],
    createdAt: {type: Schema.Types.Date, default: Date.now},
    updatedAt: {type: Schema.Types.Date, default: Date.now}
})

export const ProjectMessage = mongoose.model('ProjectMessage', projectMessageSchema);