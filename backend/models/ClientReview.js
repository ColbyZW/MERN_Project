import mongoose from "mongoose";
const { Schema } = mongoose;

const clientReviewSchema = new Schema({
    client: {type: Schema.Types.ObjectId, ref: 'Client'},
    lancer: {type: Schema.Types.ObjectId, ref: 'Lancer'},
    project: {type: Schema.Types.ObjectId, ref: 'Project'},
    reviewContents: String,
    createdAt: {type: Schema.Types.Date, default: Date.now},
    updatedAt: {type: Schema.Types.Date, default: Date.now}
})

export const ClientReview = mongoose.model('ClientReview', clientReviewSchema);