import mongoose from "mongoose";
const { Schema } = mongoose;

const lancerAccountSchema = new Schema({
    lancer: {type: Schema.Types.ObjectId, ref: 'Lancer'},
    balance: Schema.Types.Number,
    createdAt: {type: Schema.Types.Date, default: Date.now},
    updatedAt: {type: Schema.Types.Date, default: Date.now}
})

export const LancerAccount = mongoose.model('LancerAccount', lancerAccountSchema);