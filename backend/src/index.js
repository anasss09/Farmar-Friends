import express from 'express'
import mongoose from 'mongoose'
import userRouter from './routes/auth.js'
import cookieParser from 'cookie-parser'

const app = express()
const PORT = process.env.PORT

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'))

app.use('/', userRouter)

mongoose.connect('mongodb://localhost:27017/farmerFriends')
.then(() => {
    app.listen(PORT, () => {
        console.log(`http://localhost:3000`);  
    })
})
.catch(err => {
    console.error("MongoDB connection failed:", err);    
})