"use client"
import React, { useState } from 'react'
import axios from "axios";
import { useRouter } from 'next/navigation'
import Link from 'next/link';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/app/zustand/useAuthStore';

const SigninPage = () => {

    const router = useRouter()
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('')

    const {updateAuthName} = useAuthStore()


    const signinFunc = async (e) => {
        e.preventDefault()
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_BE_HOST}:5000/auth/signin`, {
                username,
                password
            },
            {
                withCredentials: true
            })

            console.log(res);
            updateAuthName(username)
            toast.success(res.data.message)
            router.push('/chat')
 
 
        } catch (error) {
            console.log(error);
            toast.error("Error in signin function : ", error.message)
            console.log("Error in signin function : ", error.message);
        }
    }

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div href="#" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M17 3.33782C15.5291 2.48697 13.8214 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22C17.5228 22 22 17.5228 22 12C22 10.1786 21.513 8.47087 20.6622 7" stroke="#1C27" strokeWidth="1.5" strokeLinecap="round"></path> <path d="M8 12H8.009M11.991 12H12M15.991 12H16" stroke="#1C27" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
      <span className='ml-2'>Let's Chat!</span>   
      </div>
      <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                  Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={signinFunc}>
                  <div>
                      <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                      <input type="username" name="username" id="username" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="your username..." required
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)}
                      />
                  </div>
                  <div>
                      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                      <input type="password" name="password" id="password" placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)}
                      />
                  </div>
                  
                  <button type="submit"
                //   onClick={signinFunc}
                  className="w-full text-black bg-white hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800">Sign in</button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Don’t have an account yet? <Link href="/auth/signup" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                      <button>Sign up</button>
                      </Link>
                  </p>
              </form>
          </div>
      </div>
  </div>
</section>
  )
}

export default SigninPage
