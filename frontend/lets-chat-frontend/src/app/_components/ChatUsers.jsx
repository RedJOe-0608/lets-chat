import React, { useEffect } from 'react'
import { useUsersStore } from '../zustand/useUsersStore'
import { useChatReceiverStore } from '../zustand/useChatReceiverStore';
import { useChatMessagesStore } from '../zustand/useChatMessagesStore';
import axios from 'axios';
import { useAuthStore } from '../zustand/useAuthStore';

const ChatUsers = () => {

 const { users } = useUsersStore();
 const {authName} = useAuthStore()

 const {chatReceiver,updateChatReceiver} = useChatReceiverStore()
 const {updateChatMessages} = useChatMessagesStore()

 const getMsgs = async () => {
  const res = await axios.get('http://localhost:8080/messages',
      {
          params: {
              'sender': authName,
              'receiver': chatReceiver
          }
      },
      {
          withCredentials: true
      });
  if (res.data.length !== 0) {
    updateChatMessages(res.data);
  } else {
    updateChatMessages([]);
  }
}


 useEffect(()=> {

  if(chatReceiver) {
    getMsgs();
}

 },[chatReceiver])

 return (
   <div className='  w-1/5 bg-gray-800 overflow-y-auto px-4 py-2 text-black'>
    <h1 className='text-2xl text-white mb-5'>Chats</h1>
     {users.map((user, index) => (
               <div 
               onClick={() => updateChatReceiver(user.username)}
               key={index} className='p-2 bg-white rounded shadow mb-5'>
                       {user.username}
               </div>
           ))}
   </div>
 )
}

export default ChatUsers