import React, { useState } from 'react'
import { MdClose } from "react-icons/md";
import { useUsersStore } from '../zustand/useUsersStore'
import { useSocketStore } from '../zustand/useSocketStore';

const Modal = ({ closeModal }) => {

    const { users } = useUsersStore();
    const {socket} = useSocketStore()

    const [groupName, setGroupName] = useState('')
    const [selectedParticipants, setSelectedParticipants] = useState([]);

    const createGroup = (e) => {
        e.preventDefault()
        console.log(socket.id);
        console.log('group name:',groupName);
        console.log('Participants are: ', selectedParticipants);
        closeModal()

        socket.emit('joinRoom',groupName,selectedParticipants)
    }

    const handleParticipantChange = (e) => {
        const value = e.target.value;
        if (e.target.checked) {
          setSelectedParticipants([...selectedParticipants, value]);
        } else {
          setSelectedParticipants(selectedParticipants.filter((participant) => participant !== value));
        }
      };

    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 w-1/3 rounded-lg shadow-lg">
          <div className="flex justify-between mb-2 items-center">
            <h2 className="text-2xl font-bold ">Create/Join Group</h2>
            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
            <MdClose fontSize={25} />
            </button>
          </div>

            <h4 className='text-xs mb-5 text-gray-500'>If a group with the mentioned name does not exist, a new group will be created.</h4>
          <form onSubmit={createGroup}>
            <div className="mb-5">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="groupName">
                Group Name  
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="groupName"
                type="text"
                placeholder="Group Name..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </div>
            <div className="mb-5">
                <label className="block text-gray-700 text-sm font-bold mb-2">
              Add Participants
            </label>
            <div className="flex flex-col space-y-2">
             {users.map((user,index) => (
                 <label key={index} className="inline-flex items-center">
                 <input type="checkbox" name="participant" value={user.username}
                 onChange={handleParticipantChange}
                 />
                 <span className="ml-2">{user.username}</span>
               </label>
             ))}
            </div>
          </div>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Join
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

export default Modal
