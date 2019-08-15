import mongoose from 'mongoose'
import * as mongoosesequence from  'mongoose-sequence'
const AutoIncrement = mongoosesequence(mongoose);

let dashboardSchema = new mongoose.Schema({
    name: String,
    items: [],
    created_by: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
        required:true
    }
},
{timestamps: true}
)

dashboardSchema.plugin(AutoIncrement, {inc_field: 'id'});

export const Dashbard = mongoose.model('dashboard', dashboardSchema)