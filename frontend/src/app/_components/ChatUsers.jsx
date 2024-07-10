import React, { useEffect, useState } from 'react'
import { useUsersStore } from '../zustand/useUsersStore'
import { useChatReceiverStore } from '../zustand/useChatReceiverStore';
import { useChatMessagesStore } from '../zustand/useChatMessagesStore';
import axios from 'axios';
import { useAuthStore } from '../zustand/useAuthStore';
import { FaPlus } from "react-icons/fa";
import Modal from './Modal';
import { useGroupsStore } from '../zustand/useGroupsStore';

const ChatUsers = () => {

 const { users } = useUsersStore();
 const {groups} = useGroupsStore()
 const {authName} = useAuthStore()

 const {chatReceiver,updateChatReceiver} = useChatReceiverStore()
 const {updateChatMessages} = useChatMessagesStore()


 const [isModalOpen, setIsModalOpen] = useState(false);

 const openModal = () => {
   setIsModalOpen(true);
 };

 const closeModal = () => {
   setIsModalOpen(false);
 };

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
   <div className=' relative flex flex-col w-1/5 bg-gray-800 overflow-y-auto px-4 py-2 text-black'>
      <div>
        <h1 className='text-2xl text-white mb-5'>Chats</h1>
        {users.map((user, index) => (
                  <div 
                  onClick={() => updateChatReceiver(user.username)}
                  key={index} className='p-2 bg-white rounded shadow mb-5'>
                          {user.username}
                  </div>
              ))}
      </div>
      <div className='mt-5'>
        <div className=' flex justify-between items-center mb-5'>
          <h1 className='text-2xl text-white'>Groups</h1>
          <FaPlus className='cursor-pointer' color='white'
          onClick={openModal}
          />
          {isModalOpen && <Modal closeModal={closeModal} />}       
        </div>
        <div>
        {groups.map((group, index) => (
                  <div 
                  // onClick={() => updateChatReceiver(user.username)}
                  key={index} className='p-2 bg-white rounded shadow mb-5'>
                          {group.groupName}
                  </div>
              ))}
        </div>
      </div>

   </div>
 )
}

export default ChatUsers