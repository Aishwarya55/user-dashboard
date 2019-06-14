import mongoose from 'mongoose'
import config from '../config'

export const connect = async () =>{
    mongoose.connect(config.dbUrl, {useNewUrlParser: true});
    return mongoose
} 
