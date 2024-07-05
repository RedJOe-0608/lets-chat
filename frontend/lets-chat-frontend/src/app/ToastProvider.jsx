"use client"
import React from 'react'
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify'

const ToastProvider = ({children}) => {
  return (
    <div>
      {children}
      <ToastContainer />
    </div>
  )
}

export default ToastProvider
