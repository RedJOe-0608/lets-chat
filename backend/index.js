import express from "express"
import dotenv from "dotenv"
import http from 'http'
import { Server } from "socket.io"
import cors from 'cors'
import connectToDB from "./db/connectToMongo.js"
import { addMsgToConversation } from "./controllers/messagesController.js"
import messagesRouter from './routes/messagesRoutes.js'
import getMyGroupsRouter from './routes/getMyGroupsRoutes.js'
import { subscribe,publish, unsubscribe } from "./redis/MessagesPubSub.js"


dotenv.config()
const PORT = process.env.PORT || 5000
connectToDB()

const app = express()
app.use(cors({
    credentials: true,
    origin: [`${process.env.BE_HOST}:3000`,`${process.env.BE_HOST}:3001`,`${process.env.BE_HOST}:3002`],
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

    // socket.on('subscribeToGroupChannels',(groups)=> {
    //     // console.log("The groups are: " ,groups);
    //     console.log("Subscribing to channels...");

    //     groups.forEach((group) => {
    //         const groupName = `group_${group.groupName}`
    //         subscribe(groupName, (message) => {
    //             const receiver = JSON.parse(message).receiver
    //             console.log(`This is group subscriber of ${username}. msg is ${message}`);

    //             socket.to(receiver).emit("receive-message", JSON.parse(message));
    //         })
    //     })
    // })

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
            // socket.to(msgInfo.groupName).emit("receive-message",message)
            const channelName = `group_${msgInfo.groupName}`
            publish(channelName, JSON.stringify(message));
        }
        else{
            const receiverSocket = userSocketMap[msgInfo.participants[1]];
            if(receiverSocket)
            {
                receiverSocket.emit("receive-message",message)
                console.log(`msg emitted to ${msgInfo.participants[1]}`);
            }else{
                const channelName = `chat_${msgInfo.participants[1]}`
                publish(channelName, JSON.stringify(message));
            }

        }

        addMsgToConversation(msgInfo.participants,msgInfo.groupName,message)
    })

    socket.on('ws-disconnect',() => {
        console.log("Websocket connection disconnected");
    })

    socket.on('subscribeToRedisChannels',(groups,authName) => {

    //each client is subscribed to its own channel, as well as all the groups the client is part of.
            
    // subscribing to chat channel 
    const channelName = `chat_${authName}`
    subscribe(channelName, (message) => {
        console.log("This is chat subscriber");
        io.emit("receive-message", JSON.parse(message));
        console.log("Chat subscriber has done its job");
    });

    //subscribing to group channels

        const groupNames = groups.map(group => group.groupName)

        for(let i=0;i<groupNames.length;i++)
        {
            const groupName = `group_${groupNames[i]}`
                subscribe(groupName, (message) => {
                    const receiver = JSON.parse(message).receiver
                    console.log("This is group subscriber");
                    io.to(receiver).emit("receive-message", JSON.parse(message));
                    console.log("group subscriber has done its job");
                })

        }
        
    })

    socket.on('joinRooms',(username,groupNames)=> {

        for(let i=0;i<groupNames.length;i++)
        {
            socket.join(groupNames[i])
            console.log(`${username} joined group ${groupNames[i]}`);

            //  subscribing to group channels
        
            // const groupName = `group_${groupNames[i]}`
            // subscribe(groupName, (message) => {
            //     const receiver = JSON.parse(message).receiver
            //     console.log("This is group subscriber");
            //     socket.to(receiver).emit("receive-message", JSON.parse(message));
            //     console.log("group subscriber has done its job");
            // })
        
        }
    })

    //join a room
    socket.on('joinRoom',(groupName,participants) => {

        console.log("Group participants" + participants);
        
        socket.join(groupName)
    
        addMsgToConversation(participants,groupName)

        const group = `group_${groupName}`
        subscribe(group, (message) => {
            const receiver = JSON.parse(message).receiver
            console.log("This is group subscriber");
            console.log(`message sent from redis to group ${receiver} and username: ${username}`);
            io.to(receiver).emit("receive-message", JSON.parse(message));
    })
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