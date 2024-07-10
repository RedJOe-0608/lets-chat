import express from "express"
import dotenv from "dotenv"
import http from 'http'
import { Server } from "socket.io"
import cors from 'cors'
import connectToDB from "./db/connectToMongo.js"
import { addMsgToConversation } from "./controllers/messagesController.js"
import messagesRouter from './routes/messagesRoutes.js'
import groupMessagesRouter from './routes/groupMessagesRoutes.js'
import { addMsgToGroupConversation, createGroupConversation } from "./controllers/groupMessagesController.js"

dotenv.config()
const PORT = process.env.PORT || 5000
connectToDB()

const app = express()
app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000","http://localhost:3001","http://localhost:3002"],
}))

app.use('/messages',messagesRouter)
app.use('/groups',groupMessagesRouter)

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

    //join a room
    socket.on('joinRoom',(groupName,participants) => {
        socket.join(groupName)
        console.log(`Socket ${socket.id} joined room ${groupName}`);

        createGroupConversation(groupName,participants)
    })

    socket.on('group-chat-message',(groupName, message) => {
        addMsgToGroupConversation(groupName,message)
    })

      // Leave a room
  socket.on('leaveRoom', (groupName) => {
    socket.leave(groupName);
    console.log(`Socket ${socket.id} left room ${groupName}`);
  });

})

app.get('/',(req,res) => {
    res.send('Hello from backend!')
})

server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}...`);
})