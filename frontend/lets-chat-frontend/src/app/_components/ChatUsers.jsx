import React from 'react'
import { useUsersStore } from '../zustand/useUsersStore'
import { useChatReceiverStore } from '../zustand/useChatReceiverStore';

const ChatUsers = () => {
 const { users } = useUsersStore();

 const {updateChatReceiver} = useChatReceiverStore()

 return (
   <div className=' bg-blue-600 w-1/5'>
     {users.map((user, index) => (
               <div 
               onClick={() => updateChatReceiver(user.username)}
               key={index} className='bg-slate-400 rounded-xl m-3 p-5'>
                       {user.username}
               </div>
           ))}
   </div>
 )
}

export default ChatUsers