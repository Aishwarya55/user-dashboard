import express from 'express'
import {json, urlencoded} from 'body-parser'
import cors from 'cors'
import { connect } from './utils/dbConnection'

export const app = express()

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))

// app.use('/', (request, response)=>{
// response.send({'message':"hello"})
// })

export const start = async () => {
    try {
        await connect()
        app.listen(3000, ()=> {
        console.log("server is running.....")
    })
    } catch (e){
        console.log(e)
    }
} 
