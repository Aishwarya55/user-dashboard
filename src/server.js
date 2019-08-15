import express from 'express'
import {json, urlencoded} from 'body-parser'
import cors from 'cors'
import { connect } from './utils/dbConnection'
import userRouter from './resources/user/user.router'
import {signin, signup, protect } from './utils/auth'
import dashboardRouter from './resources/dashboard/dashboard.router'

export const app = express()

app.use(cors())
app.use(json())
app.use(urlencoded({ extended: true }))

// app.use('/', (request, response)=>{
// response.send({'message':"hello"})
// })

app.post('/signup', signup)
app.post('/signin', signin)

app.use('/api', protect)
app.use('/api/user', userRouter)
app.use('/api/dashboard', dashboardRouter)

export const start = async () => {
  debugger;
    try {
        await connect()
        app.listen(3000, ()=> {
         
        console.log("server is running.....")
    })
    } catch (e){
        console.log(e)
    }
} 
