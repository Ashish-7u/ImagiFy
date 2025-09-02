import React, { useContext } from 'react'
import Home from './pages/Home'
import Result from './pages/Result'
import BuyCredit from './pages/BuyCredit'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './components/Login'
import { AppContext } from './context/AppContext'
import { ToastContainer } from 'react-toastify';
import ForgotPassword from './components/ForgotPassword'
import ResetPassword from './components/ResetPassword'

const App = () => {

  const { showLogin } = useContext(AppContext)
  return (
    <div className='min-h-screen flex flex-col bg-gradient-to-b from-teal-50 to-orange-50 px-4 sm:px-10 md:px-14 lg:px-28'>
      <ToastContainer position='bottom-right' />
      <Navbar />
      {showLogin && <Login />}
     <main className='flex-grow'>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/result' element={<Result />} />
          <Route path='/buy' element={<BuyCredit />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
