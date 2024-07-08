import express from 'express'
import dotenv from 'dotenv'
import authRouter from './routes/authRoute.js'
import usersRouter from './routes/usersRoute.js'
import connectToDB from './db/connectToMongo.js'
import cors from 'cors'
import cookieParser from "cookie-parser";

dotenv.config()
const PORT = process.env.PORT || 5000

const app = express()

app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000","http://localhost:3001","http://localhost:3002"],
    // methods: ["GET", "POST"],
    // allowedHeaders: ["*"],
   }));
app.use(cookieParser())   
app.use(express.json())
app.use(express.urlencoded({extended: true}))
connectToDB()

app.get('/',(req,res) => {
    res.send('Helloooooo')
})

app.use('/auth',authRouter)
app.use('/users',usersRouter)

app.listen(PORT,() => {
    console.log(`server listening on port ${PORT}`);
})
