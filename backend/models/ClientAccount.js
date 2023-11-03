import mongoose from "mongoose";
const { Schema } = mongoose;

const clientAccountSchema = new Schema({
    client: {type: Schema.Types.ObjectId, ref: 'Client'},
    balance: Schema.Types.Number,
    createdAt: {type: Schema.Types.Date, default: Date.now},
    updatedAt: {type: Schema.Types.Date, default: Date.now}
})

export const ClientAccount = mongoose.model('ClientAccount', clientAccountSchema);