import express from 'express'
import dotenv from 'dotenv'
import authRouter from './routes/authRoute.js'
import connectToDB from './db/connectToMongo.js'

dotenv.config()
const PORT = process.env.PORT || 5000

const app = express()
app.use(express.json())
connectToDB()

app.get('/',(req,res) => {
    res.send('Helloooooo')
})

app.use('/auth',authRouter)

app.listen(PORT,() => {
    console.log(`server listening on port ${PORT}`);
})
