import express from "express"
import dotenv from "dotenv"
import http from 'http'
import { Server } from "socket.io"
import cors from 'cors'
import connectToDB from "./db/connectToMongo.js"
import { addMsgToConversation } from "./controllers/messagesController.js"
import messagesRouter from './routes/messagesRoutes.js'
import getMyGroupsRouter from './routes/getMyGroupsRoutes.js'


dotenv.config()
const PORT = process.env.PORT || 5000
connectToDB()

const app = express()
app.use(cors({
    credentials: true,
    origin: ["http://localhost:3000","http://localhost:3001","http://localhost:3002"],
}))

app.use('/messages',messagesRouter)
app.use('/groups',getMyGroupsRouter)

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

    socket.on('chat-message', (msgInfo) => {
        //for testing
        console.log('Received message ' + msgInfo.text);
        console.log('Sender: ' + msgInfo.sender);
        console.log('Participants are: ' + msgInfo.participants);
        console.log("Group Name: ", msgInfo.groupName);

        const message = {
            text: msgInfo.text,
            sender: msgInfo.sender,
            receiver: msgInfo.groupName ? msgInfo.groupName : msgInfo.participants[1]
        }

        if(msgInfo.groupName !== '')
        {
            socket.to(msgInfo.groupName).emit("receive-message",message)
        }
        else{
            const receiverSocket = userSocketMap[msgInfo.participants[1]];
            if(receiverSocket)
                receiverSocket.emit("receive-message",message)
            console.log(`msg emitted to ${msgInfo.participants[1]}`);
        }

        addMsgToConversation(msgInfo.participants,msgInfo.groupName,message)
    })

    socket.on('joinRooms',(username,groupNames)=> {
        for(let i=0;i<groupNames.length;i++)
        {
            socket.join(groupNames[i])
            console.log(`${username} joined group ${groupNames[i]}`);
        }
    })

    //join a room
    socket.on('joinRoom',(groupName,participants) => {
        console.log("Group participants" + participants);
        if(!participants)
        {
            socket.join(groupName)
        }
        else
        {
            for(let i=0;i<participants.length;i++)
            {
                const skt = userSocketMap[participants[i]]
                if(skt)
                    skt.join(groupName)
                console.log(`${participants[i]} joined group ${groupName}`);
                // console.log(`Socket ${skt.id} joined room ${groupName}`);
                // console.log(skt);
            }
    
            addMsgToConversation(participants,groupName)
        }
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