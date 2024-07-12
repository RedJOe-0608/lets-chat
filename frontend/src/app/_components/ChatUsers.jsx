import React, { useEffect, useState } from 'react'
import { useUsersStore } from '../zustand/useUsersStore'
import { useChatReceiverStore } from '../zustand/useChatReceiverStore';
import { useChatMessagesStore } from '../zustand/useChatMessagesStore';
import axios from 'axios';
import { useAuthStore } from '../zustand/useAuthStore';
import { FaPlus } from "react-icons/fa";
import Modal from './Modal';
import { useGroupsStore } from '../zustand/useGroupsStore';
import { useGroupParticipantsStore } from '../zustand/useGroupParticipantsStore';

const ChatUsers = ({currentGroupName,setCurrentGroupName}) => {

 const { users } = useUsersStore();
 const {groups,updateGroups} = useGroupsStore()
 const {authName} = useAuthStore()

 const [newGroup, setNewGroup] = useState('')

 const {chatReceiver,updateChatReceiver} = useChatReceiverStore()
 const {updateChatMessages} = useChatMessagesStore()
 const{groupParticipants} = useGroupParticipantsStore()


// this useEffect is for updating the UI after a new group has been created. 
 useEffect(() => {
  console.log(newGroup);
  updateGroups([...groups,{groupName:newGroup}])
 },[newGroup])

console.log(groups);
 const [isModalOpen, setIsModalOpen] = useState(false);

 const openModal = () => {
   setIsModalOpen(true);
 };

 const closeModal = () => {
   setIsModalOpen(false);
 };

 const handleSingleUsers = (user) => {
  updateChatReceiver(user.username)
  setCurrentGroupName('')
 }

 const handleGroups = (group) => {
  updateChatReceiver(group.groupName)
  setCurrentGroupName(group.groupName)
 }

 const getMsgs = async () => {

    const res = await axios.get('http://localhost:8080/messages',
        {
            params: {
                "participants": currentGroupName ? groupParticipants : [authName,chatReceiver],
                "groupName": currentGroupName
            }
        },
        {
            withCredentials: true
        });

  console.log(res.data);
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
                  onClick={() => handleSingleUsers(user)}
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
          {isModalOpen && <Modal 
          closeModal={closeModal} 
          setNewGroup={setNewGroup} 
          />}       
        </div>
        <div>
        {groups.map((group, index) => (
                  <div 
                  onClick={() => handleGroups(group)}
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