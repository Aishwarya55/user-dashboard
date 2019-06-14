import mongoose from 'mongoose'
 let Schema = mongoose.Schema;

 const userSchema = new Schema({
    name: String,
    password: String,
    emailid: String,
    settings:{
        theme:{
            type: String,
            required: true,
            default:'light'
        }
    }, 
 },
 {timestamps: true}
)

export const User = mongoose.model('user', userSchema)