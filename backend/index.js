import express from "express"
import dotenv from "dotenv"
import http from 'http'
import { Server } from "socket.io"


dotenv.config()
const PORT = process.env.PORT || 5000

const app = express()
const server = http.createServer(app)
const io = new Server(server,{
    cors: {
        allowedHeaders: ["*"],
        origin: "*"
    }
})

io.on('connection', (socket) => {
    console.log('client connected!');

    socket.on('chat message', (msg) => {
        console.log('Received message ' + msg);
      
        io.emit('chat message', msg);
    })

})

app.get('/',(req,res) => {
    res.send('Hello from backend!')
})

server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}...`);
})