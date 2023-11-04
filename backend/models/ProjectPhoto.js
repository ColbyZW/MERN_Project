import mongoose from "mongoose";
const { Schema } = mongoose;

const projectPhotoSchema = new Schema({
    project: {type: Schema.Types.ObjectId, ref: 'Project'},
    photos: [{type: Schema.Types.ObjectId, ref: 'Photo'}]
})

export const ProjectPhoto = mongoose.model('ProjectPhoto', projectPhotoSchema);