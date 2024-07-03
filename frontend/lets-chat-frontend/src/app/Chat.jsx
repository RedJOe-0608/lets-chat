"use client"
import React, { useEffect, useState } from 'react'
import io from 'socket.io-client'


const Chat = () => {

  const [message, setMessage] = useState("")
  const [socket,setSocket] = useState(null)

  useEffect(() => {
    //establish websocket connection.
    const newSocket = io('http://localhost:8080')
    setSocket(newSocket)

    //cleanup function
    return () => newSocket.close()

  },[])

  const sendMessage = (e) => {
    e.preventDefault()
    console.log(message);
    if(socket){
      socket.emit('chat message',message)
      setMessage('')
    }
  }

  return (
    <div className='min-w-[40%]'>
      <h1>Chat</h1>
      <form onSubmit={sendMessage} className='my-10' >

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