import express from "express"
import dotenv from "dotenv"
import http from 'http'
import { Server } from "socket.io"
import cors from 'cors'

dotenv.config()
const PORT = process.env.PORT || 5000

const app = express()
app.use(cors())
const server = http.createServer(app)
const io = new Server(server,{
    cors: {
        allowedHeaders: ["*"],
        origin: "*",
        methods: ["GET", "POST"]
    }
})

io.on('connection', (socket) => {
    console.log(`client connected: ${socket.id}`);

    socket.on('chat-message', (msg) => {
        console.log('Received message ' + msg);
        socket.broadcast.emit("recieve-message",msg)
    })

})

app.get('/',(req,res) => {
    res.send('Hello from backend!')
})

server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}...`);
})