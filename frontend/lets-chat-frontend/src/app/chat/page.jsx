"use client"
import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'
import { useAuthStore } from '../zustand/useAuthStore'
import axios from "axios";
import { useUsersStore } from '../zustand/useUsersStore';
import ChatUsers from '../_components/ChatUsers';
import { useChatReceiverStore } from '../zustand/useChatReceiverStore';

const ChatPage = () => {
  
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([]);
  const [socket,setSocket] = useState(null)
  
  const {authName} = useAuthStore()
  const {users,updateUsers} = useUsersStore()
  const {chatReceiver}= useChatReceiverStore()

  const getUsers = async() => {
    const res = await axios.get('http://localhost:5000/users',
      {
          withCredentials: true
      })
    // console.log(res.data);
    updateUsers(res.data)
  }
  
  useEffect(() => {

    //establish websocket connection when the component mounts.
    const newSocket = io('http://localhost:8080',{
      query: {
        username: authName
      }
    })
    setSocket(newSocket)
    
    newSocket.on('receive-message',(message)=> {
      setMessages(prevMessages => [...prevMessages, {text: message.text, sentByCurrUser: false}])
    })

    getUsers()
    
    // Cleanup function to remove the event listener when the component unmounts.
    return () => newSocket.off('receive-message')

  },[])

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
      setMessages(prevMessages => [...prevMessages, {text: message, sentByCurrUser: true}])
      setMessage('')
    }
  }

  return (
    <div className='h-screen flex divide-x-4'>
        <ChatUsers />
        <div className=' w-4/5 bg-red-500 flex flex-col justify-between'>
    <span>
      {authName} is chatting with {chatReceiver}
    </span>
    <div className='msgs-container text-right m-5 h-4/5 overflow-y-auto'>
              {messages.map((message, index) => (
                <div key={index} 
                  className={`msg my-5 ${message.sentByCurrUser ? 'text-right' : 'text-left'} `}
                >
                  <span className={`${message.sentByCurrUser ? 'bg-blue-200' : 'bg-green-200'} p-3 rounded-lg`}>
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
                    placeholder="Type your text here"
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
  )
}

export default ChatPage