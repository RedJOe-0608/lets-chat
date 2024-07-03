"use client"
import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'

const Chat = () => {
  
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([]);
  const [socket,setSocket] = useState(null)

  
  useEffect(() => {

    //establish websocket connection when the component mounts.
    const newSocket = io('http://localhost:8080')
    setSocket(newSocket)
    
    newSocket.on('recieve-message',(msg)=> {
      setMessages(prevMessages => [...prevMessages, msg])
    })
    
    // Cleanup function to remove the event listener when the component unmounts.
    return () => newSocket.off('recieve-message')

  },[])

  const sendMessage = (e) => {
    e.preventDefault()
    console.log(message);
    if(socket){
      socket.emit('chat-message',message)
      setMessages(prevMessages => [...prevMessages, message])
      setMessage('')
    }
  }

  return (
    <div className='min-h-[100vh] flex flex-col justify-between'>

      <div className='msgs-container text-right m-5'>
                {messages.map((message, index) => (
                    <div key={index} className='msg text-right my-5'>
                        {message}
                    </div>
                ))}
      </div>
      
      {/* <h1>Chat</h1> */}
      <form onSubmit={sendMessage} className='my-10  min-w-[40%] mx-auto' >

      <div class="relative">  
               <input type="text"
                       value={message}
                       onChange={(e) => setMessage(e.target.value)}
                       placeholder="Type your text here"
                       required
                       className="w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"  />
               <button type="submit"
                       className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                       Send
               </button>
           </div>

     
      </form>
    </div>
  )
}

export default Chat