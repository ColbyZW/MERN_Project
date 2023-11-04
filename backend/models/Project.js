import mongoose from "mongoose";
const { Schema } = mongoose;

const projectSchema = new Schema({
    client: {type: Schema.Types.ObjectId, ref: 'Client'},
    lancer: {type: Schema.Types.ObjectId, ref: 'Lancer'},
    projectMessages: {type: Schema.Types.ObjectId, ref: 'ProjectMessage'},
    name: String,
    description: String,
    pay: String,
    startDate: {type: Schema.Types.Date},
    endDate: {type: Schema.Types.Date},
    createdAt: {type: Schema.Types.Date, default: Date.now},
    updatedAt: {type: Schema.Types.Date, default: Date.now},
    clientReview: [{type: Schema.Types.ObjectId, ref: 'ClientReview'}],
    lancerReview: [{type: Schema.Types.ObjectId, ref: 'LancerReview'}]
})

export const Project = mongoose.model('Project', projectSchema);