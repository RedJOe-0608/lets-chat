import React from 'react'
import { useAuthStore } from '../zustand/useAuthStore'

const Navbar = () => {

  const {authName} = useAuthStore()

  return (
    <nav className="bg-white h-12 border-gray-200 dark:bg-gray-800">
  <div className="max-w-screen-xl flex flex-wrap items-center justify-between p-4">
    <div className="flex items-center space-x-3 rtl:space-x-reverse">
    <svg viewBox="0 0 24 24" className='h-6' fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7" stroke="#1C27" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M8 12H8.009M11.991 12H12M15.991 12H16" stroke="#1C27" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
        <span className="self-center text-sm font-semibold whitespace-nowrap dark:text-white">Let's Chat</span>
    </div>
    <h3 className='text-white'>{authName}</h3>
    {!authName && (<h3 className='text-white'>authName not found!</h3>)}
    </div>
    </nav>
  )
}

export default Navbar