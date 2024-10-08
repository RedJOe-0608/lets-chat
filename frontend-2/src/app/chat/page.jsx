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
import { useGroupParticipantsStore } from '../zustand/useGroupParticipantsStore';
import { InfinitySpin, Watch } from 'react-loader-spinner'
import { toast } from 'react-toastify';

const ChatPage = () => {
  
  const [message, setMessage] = useState("")
  const [sentMessage,setSentMessage] = useState({})
  const [receivedMessage,setReceivedMessage] = useState({})
  const [socket,setSocket] = useState(null)
  const [currentGroupName,setCurrentGroupName] = useState('')

  const {authName,updateAuthName} = useAuthStore()
  const {users,updateUsers} = useUsersStore()
  const {groups,updateGroups} = useGroupsStore()
  const {chatReceiver}= useChatReceiverStore()
  const {chatMessages,updateChatMessages}= useChatMessagesStore()
  const {groupParticipants,updateGroupParticipants} = useGroupParticipantsStore()
  const {updateSocket}= useSocketStore()

  const [hydrated, setHydrated] = useState(false);

  // Hydration useEffect
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    let newSocket = null

    if(hydrated)
    {
      console.log("Component is hydrated, establishing WebSocket connection");

      //establish websocket connection when the component mounts.
      newSocket = io(`${process.env.NEXT_PUBLIC_BE_HOST}:8081`,{
      query: {
        username: authName
      }
    })
    setSocket(newSocket)
    updateSocket(newSocket)
    console.log(newSocket);
    
      getUsers()
      getMyGroups(authName,newSocket)  
         
    // Cleanup function to remove the event listener when the component unmounts.
    return () => {
      console.log("Cleanup function called");
      newSocket.emit("ws-disconnect")
      newSocket.disconnect();
      console.log("Websocket connection disconnected");
    }

  }
  return () => {
    console.log("useEffect cleanup on dependency change or unmount");
  };


  },[hydrated,authName])


  // useEffect(() => {
  //   const handleBeforeUnload = () => {
  //     if (socket) {
  //       console.log("Page is refreshing or closing");
  //       socket.emit("ws-disconnect");
  //       socket.disconnect();
  //       console.log("WebSocket connection disconnected in handleBeforeUnload");
  //     }
  //   };

  //   window.addEventListener("beforeunload", handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener("beforeunload", handleBeforeUnload);
  //     if (socket) {
  //       console.log("Cleanup function called during unmount");
  //       socket.emit("ws-disconnect");
  //       socket.disconnect();
  //       console.log("WebSocket connection disconnected during unmount");
  //     }
  //   };
  // }, [socket]);


  useEffect(()=> {
    if(groups.length > 0 && authName)
    {
      console.log("...");
      socket.emit('subscribeToRedisChannels',groups,authName)
    }
  },[socket,groups,authName])

  useEffect(() => {
    if(hydrated && socket)
    {
      socket.on('receive-message',(message)=> {

        console.log("received message", message);
          setReceivedMessage(message)          
      })
    }
  },[hydrated,socket])

  useEffect(()=> {
    if(hydrated && !currentGroupName)
        updateChatMessages([...chatMessages,sentMessage])
    },[hydrated, sentMessage])

  useEffect(()=> {
    if(hydrated && receivedMessage)
      updateChatMessages([...chatMessages,receivedMessage])
  },[hydrated, receivedMessage])

   // for toast notification on new message 
   useEffect(()=> {
    if(hydrated && Object.keys(receivedMessage).length > 0)
    {
        let isGroupMessage = false
              groups.forEach((group) => {
                if(group.groupName === receivedMessage.receiver)
                  isGroupMessage = true
              })
      
              if(isGroupMessage )
              {
                if(receivedMessage.sender !==authName)
                  toast.info(`Message from ${receivedMessage.sender} in ${receivedMessage.receiver}`)
              }
              else
              toast.info(`Message from ${receivedMessage.sender}`)

      updateChatMessages([...chatMessages,receivedMessage])
    }
    
  },[hydrated, receivedMessage,groups])

  if (!hydrated) {
    // Render a loader until hydration is complete
    return <div className='h-screen w-full flex justify-center items-center'>
      <Watch
    visible={true}
    height="80"
    width="80"
    radius="48"
    color="#4fa94d"
    ariaLabel="watch-loading"
    wrapperStyle={{}}
    wrapperClass=""
    />
    </div>
  }

  const getUsers = async() => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BE_HOST}:5000/users`,
      {
          withCredentials: true
      })
    // console.log(res.data);
    updateUsers(res.data)
  }

  const getMyGroups = async(username,skt) => {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_BE_HOST}:8080/groups`,
      {
        params: {
          username
        }
      }
      ,
      {
      withCredentials: true
    })
    console.log(res.data);
    const grpNames = []
    res.data.map((grp) => {
      grpNames.push(grp.groupName)
    })
    console.log(`${authName} is part of ${grpNames} groups`);

    if (skt) {
      skt.emit("joinRooms", authName, grpNames);
    } else {
      console.error('Socket is not initialized');
    }
    updateGroups(res.data)
  }

  const sendMessage = (e) => {
    e.preventDefault()
    const msgInfo = {
      text: message,
      sender: authName,
      participants: currentGroupName ? groupParticipants : [authName,chatReceiver],
      groupName: currentGroupName || ''
    }
    console.log("sent message", message);
    console.log("current group name",currentGroupName);
    if(socket){
      socket.emit('chat-message',msgInfo)
      setSentMessage({
        text: message,
      sender: authName,
      receiver: currentGroupName ? currentGroupName : chatReceiver,
      })
      setMessage('')
    }
  }

  console.log("Chat receiver is: ",chatReceiver);

  return (
    <div className='flex flex-col h-screen'>
    <Navbar />
    <div className=' flex h-12 flex-grow divide-x-4'>
        <ChatUsers 
        currentGroupName={currentGroupName}
        setCurrentGroupName={setCurrentGroupName}
        receivedMessage={receivedMessage}
        />
        <div className=' w-4/5 bg-gray-900 text-gray-200 flex flex-col justify-between'>
    <div className='w-full bg-gray-700 h-20'>
      <h2 className='text-md p-4'>{chatReceiver}</h2>
    </div>
    <div className='msgs-container text-right p-2 m-5 h-4/5 overflow-y-auto'>
              {chatMessages && chatMessages?.map((message, index) => (
                <div key={index} 
                className={`msg my-10 ${message?.sender === authName ? 'text-right' : 'text-left'}`}
                >
                  <div>
                  <span className={`${ message?.sender === authName ? 'bg-orange-500' :
                  (( message.receiver === authName && message?.sender === chatReceiver) //1:1 msg
                  || 
                  (message?.receiver !== authName && message?.receiver === chatReceiver)) //group msg
                  ? 'bg-blue-500' : 'hidden'} p-3 rounded-lg `}
                >
                    {message?.text}
                </span>
                  </div>
                    {(message?.receiver !== authName && message?.receiver === chatReceiver) &&currentGroupName && 
                    (
                      <div className={` mt-3 text-sm text-gray-400 truncate`}>
                      <span className='w-20' >{message?.sender}</span>
                      </div>
                    )}
                </div>
              ))}
    </div>
    
    <form onSubmit={sendMessage} className='mb-6 h-1/5 flex items-end justify-center' >

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