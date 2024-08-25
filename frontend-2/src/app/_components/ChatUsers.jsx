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

const ChatUsers = ({currentGroupName,setCurrentGroupName,receivedMessage}) => {

 const { users } = useUsersStore();
 const {groups,updateGroups} = useGroupsStore()
 const {authName} = useAuthStore()

 const [newGroup, setNewGroup] = useState('')
 
 const {chatReceiver,updateChatReceiver} = useChatReceiverStore()
 const {updateChatMessages} = useChatMessagesStore()
 const{groupParticipants} = useGroupParticipantsStore()
 
 const [unreadMessages, setUnreadMessages] = useState({})

 useEffect(() => {
  console.log(users);
  console.log(groups);
  if (users.length > 0 || groups.length > 0) {
    const initialUnreadMessages = {}
    users.forEach((user => {
      initialUnreadMessages[user.username] = 0
    }))
    groups.forEach((group => {
      initialUnreadMessages[group.groupName] = 0
    }))
    setUnreadMessages(initialUnreadMessages);
    console.log("Initial unread messages set:", initialUnreadMessages); // Logging initial state setup
  }

}, [users,groups]);

useEffect(() => {
  console.log("Unread messages state updated:", unreadMessages);
}, [unreadMessages]); // Log whenever unreadMessages state updates

// this useEffect is for updating the UI after a new group has been created. 
 useEffect(() => {
  if(newGroup)
  {
    console.log(newGroup);
    updateGroups([...groups,{groupName:newGroup}])
  }
 },[newGroup])

// console.log("groups",groups);
// console.log("unread msgs",unreadMessages);
// console.log("received message",receivedMessage);
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

    const res = await axios.get(`${process.env.NEXT_PUBLIC_BE_HOST}:8080/messages`,
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

 useEffect(() => {
  if (receivedMessage) {
    let newValue = ''
    if(receivedMessage.receiver === authName)
      newValue = receivedMessage.sender;
    else
      newValue = receivedMessage.receiver

    if(newValue!== undefined)
    {
      setUnreadMessages((msg) => ({
         ...msg,
         [newValue]: (msg[newValue] || 0) + 1
       }));
    }
  }

  console.log(unreadMessages);
}, [receivedMessage]);

useEffect(()=> {
  if(chatReceiver || receivedMessage)
    {
      console.log("chat receiver changed");
    console.log('minus');
    setUnreadMessages((msg) => ({
      ...msg,
      [chatReceiver]: 0
    }));
  }
    
},[chatReceiver,receivedMessage])




 return (
   <div className=' relative flex flex-col w-1/5 bg-gray-800 overflow-y-auto px-4 py-2 text-black'>
      <div>
        <h1 className='text-2xl text-white mb-5'>Chats</h1>
        {users.map((user, index) => (
                  <div 
                  onClick={() => handleSingleUsers(user)}
                  key={index} className={` ${chatReceiver === user.username ? 'bg-blue-500 text-white' : 'bg-white'} p-2 cursor-pointer  rounded shadow mb-5`}>
                          {user.username} {unreadMessages && receivedMessage.sender !== chatReceiver  ? unreadMessages[user.username] != 0 ? <span
                          className={` rounded-full bg-orange-600 p-[0.20rem] text-sm text-white`}>{unreadMessages[user.username] } </span>
                          : '' : '' }
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
                  key={index} className={` ${chatReceiver === group.groupName ? 'bg-blue-500 text-white' : 'bg-white'} p-2 cursor-pointer rounded shadow mb-5`}>
                          {group.groupName} {receivedMessage.receiver !== chatReceiver ? unreadMessages[group.groupName] !=0 ? <span
                          className={` rounded-full bg-orange-600 p-[0.20rem] text-sm text-white`}>{unreadMessages[group.groupName] } </span> : '' : ''}
                  </div>
              ))}
        </div>
      </div>

   </div>
 )
}

export default ChatUsers