import express from 'express'
import dotenv from 'dotenv'
import authRouter from './routes/authRoute.js'
import connectToDB from './db/connectToMongo.js'
import cors from 'cors'

dotenv.config()
const PORT = process.env.PORT || 5000

const app = express()
app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000","http://localhost:3001"],
    // methods: ["GET", "POST"],
    // allowedHeaders: ["*"],
   }));
   
app.use(express.json())
app.use(express.urlencoded({extended: true}))
connectToDB()

app.get('/',(req,res) => {
    res.send('Helloooooo')
})

app.use('/auth',authRouter)

app.listen(PORT,() => {
    console.log(`server listening on port ${PORT}`);
})
