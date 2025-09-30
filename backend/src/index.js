import express from 'express'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.js'
import farmerRouter from './routes/farmer.js'
import recommendationRoutes from "./routes/recommendation.js";
import { verifyjwt } from './middleware/verifyJWT.js'
import passport from "./config/passportGoogleAuth.js";


const app = express()
const PORT = process.env.PORT

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(express.static('public'))
app.use(passport.initialize());

// Get Routes
app.get('/', (req, res) => {
    res.send('Welcome to Farmer Friends')
})

// Routes Paths
app.use('/auth', authRouter)
app.use('/api/pest',verifyjwt, farmerRouter)
app.use('/api/recommendation',verifyjwt, recommendationRoutes)

mongoose.connect(process.env.MONGODB_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`http://localhost:${PORT}`);
        })
    })
    .catch(err => {
        console.error("MongoDB connection failed:", err);
    })