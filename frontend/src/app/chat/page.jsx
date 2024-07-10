"use client"
import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useAuthStore } from '../zustand/useAuthStore'
import axios from "axios";
import { useUsersStore } from '../zustand/useUsersStore';
import ChatUsers from '../_components/ChatUsers';
import { useChatReceiverStore } from '../zustand/useChatReceiverStore';
import Navbar from '../_components/Navbar';
import { useChatMessagesStore } from '../zustand/useChatMessagesStore';
import { useSocketStore } from '../zustand/useSocketStore';
import { useGroupsStore } from '../zustand/useGroupsStore';

const ChatPage = () => {
  
  const [message, setMessage] = useState("")
  const [sentMessage,setSentMessage] = useState({})
  const [receivedMessage,setReceivedMessage] = useState({})
  const [socket,setSocket] = useState(null)
  
  const {authName} = useAuthStore()
  const {users,updateUsers} = useUsersStore()
  const {updateGroups} = useGroupsStore()
  const {chatReceiver}= useChatReceiverStore()
  const {chatMessages,updateChatMessages}= useChatMessagesStore()
  const {updateSocket}= useSocketStore()

  const getUsers = async() => {
    const res = await axios.get('http://localhost:5000/users',
      {
          withCredentials: true
      })
    // console.log(res.data);
    updateUsers(res.data)
  }

  const getGroups = async() => {
    const res = await axios.get('http://localhost:8080/groups',
      {
      withCredentials: true
    })
    console.log(res.data);
    updateGroups(res.data)
  }

  const sendMessage = (e) => {
    e.preventDefault()
    const msgToBeSent = {
      text: message,
      sender: authName,
      receiver: chatReceiver
    }
    console.log(message);
    if(socket){
      socket.emit('chat-message',msgToBeSent)
      setSentMessage(msgToBeSent)
      setMessage('')
    }
  }
  
  useEffect(() => {

    //establish websocket connection when the component mounts.
    const newSocket = io('http://localhost:8080',{
      query: {
        username: authName
      }
    })
    setSocket(newSocket)
    updateSocket(newSocket)

    newSocket.on('receive-message',(message)=> {
        setReceivedMessage(message)
    })

    getUsers()
    getGroups()
    
    // Cleanup function to remove the event listener when the component unmounts.
    return () => newSocket.off('receive-message')

  },[])

  useEffect(()=> {
    updateChatMessages([...chatMessages,receivedMessage])
  },[receivedMessage])

  useEffect(()=> {
    updateChatMessages([...chatMessages,sentMessage])
  },[sentMessage])

 

  console.log("Chat receiver is: ",chatReceiver);

  return (
    <div className='flex flex-col h-screen'>
    <Navbar />
    <div className=' flex flex-grow divide-x-4'>
        <ChatUsers />
        <div className=' w-4/5 bg-gray-900 text-gray-200 flex flex-col justify-between'>
    <div className='w-full bg-gray-700 h-20'>
      <h2 className='text-md p-4'>{chatReceiver}</h2>
    </div>
    <div className='msgs-container text-right m-5 h-4/5 overflow-y-auto'>
              {chatMessages?.map((message, index) => (
                <div key={index} 
                className={`msg my-5 ${message.sender === authName ? 'text-right' : 'text-left'} `}
                >
                <span className={`${ !chatReceiver ? 'hidden' : message.sender === authName ? 'bg-orange-500' : 'bg-blue-500'} p-3 rounded-lg`}>
                    {message.text}
                </span>
                </div>
              ))}
    </div>
    
    <form onSubmit={sendMessage} className='my-10 h-1/5 flex items-end justify-center' >

    <div className="relative min-w-[40%]">  
            <input type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your text here..."
                    required
                    className="w-full block p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  />
            <button type="submit"
                    className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Send
            </button>
        </div>

  
    </form>
  </div>
     
    </div>
    </div>
  )
}

export default ChatPage