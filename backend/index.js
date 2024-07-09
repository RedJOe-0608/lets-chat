import express from "express"
import dotenv from "dotenv"
import http from 'http'
import { Server } from "socket.io"
import cors from 'cors'
import connectToDB from "./db/connectToMongo.js"
import { addMsgToConversation } from "./controllers/messagesController.js"
import messagesRouter from './routes/messagesRoutes.js'

dotenv.config()
const PORT = process.env.PORT || 5000
connectToDB()

const app = express()
app.use(cors())

app.use('/messages',messagesRouter)

const server = http.createServer(app)
const io = new Server(server,{
    cors: {
        allowedHeaders: ["*"],
        origin: "*",
        methods: ["GET", "POST"]
    }
})

const userSocketMap = {};

io.on('connection', (socket) => {
    console.log(`client connected: ${socket.id}`);

    const username = socket.handshake.query.username;
    console.log('Username:', username);

    userSocketMap[username] = socket

    socket.on('chat-message', (msg) => {
        //for testing
        console.log('Received message ' + msg.text);
        console.log('Sender: ' + msg.sender);
        console.log('Receiver: ' + msg.receiver);
        const receiverSocket = userSocketMap[msg.receiver];
        if(receiverSocket)
            receiverSocket.emit("receive-message",msg)

        addMsgToConversation([msg.sender,msg.receiver],msg)
    })

})

app.get('/',(req,res) => {
    res.send('Hello from backend!')
})

server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}...`);
})