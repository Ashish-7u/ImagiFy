import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { motion } from "motion/react"
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'



const Login = () => {

    const navigate = useNavigate()

    const [state, setState] = useState('Login')

    const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')


    const handleForgotPasswordClick = () => {
        setShowLogin(false)       // Close the Login modal
        navigate('/forgot-password')  // Redirect to forgot password route
    }


    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {


            if (state === 'Login') {
                const { data } = await axios.post(backendUrl + '/api/user/login', { email, password })

                if (data.success) {

                    setToken(data.token)
                    setUser(data.user)
                    localStorage.setItem('token', data.token)
                    toast.success("Welcome to imagify");
                    setShowLogin(false)

                } else {

                    toast.error(data.message)

                }

            } else {

                const { data } = await axios.post(backendUrl + '/api/user/register', { name, email, password })

                if (data.success) {


                    setToken(data.token)
                    setUser(data.user)
                    localStorage.setItem('token', data.token)
                    toast.success("Registration Successful");
                    setShowLogin(false)


                } else {

                    toast.error(data.message)

                }


            }
        } catch (error) {

        }
    }

    useEffect(() => {

        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = 'unset';
        }

    }, [])



    return (

        <div

            className='fixed  top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
            <motion.form onSubmit={onSubmitHandler}
                initial={{ opacity: 0.2, y: 50 }}
                transition={{ duration: 0.3 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}

                className='relative bg-white p-10 rounded-xl text-slate-500'>
                <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
                <p className='text-sm text-center'>{state == 'Login' ? 'Welcome back! Please sign in to continue' : 'Please Sign Up to continue'}</p>

                {/* USer name field */}


                {state !== 'Login' && <div className='border px-6 py-2 flex items-center gap-3 rounded-full mt-5 bg-gray-50 focus-within:border-blue-400 transition-colors'>
                    <div className="bg-blue-100 p-2 rounded-full flex items-center justify-center">
                        <img
                            src={assets.profile_icon}
                            alt=""
                            className="w-5 h-5 object-contain"
                        />
                    </div>
                    <input
                        onChange={e => setName(e.target.value)}
                        value={name}
                        type="text"
                        className='outline-none text-sm bg-transparent flex-1'
                        placeholder='Full Name'
                        required
                    />
                </div>}


                <div className='border px-6 py-2 flex items-center gap-3 rounded-full mt-5 bg-gray-50 focus-within:border-blue-400 transition-colors'>
                    <div className="bg-blue-100 p-2 rounded-full flex items-center justify-center">
                        <img
                            src={assets.email_icon}
                            alt=""
                            className="w-5 h-5 object-contain"
                        />
                    </div>
                    <input
                        type="email"
                        onChange={e => setEmail(e.target.value)}
                        value={email}
                        className='outline-none text-sm bg-transparent flex-1'
                        placeholder='Email'
                        required
                    />
                </div>

                <div className='border px-6 py-2 flex items-center gap-3 rounded-full mt-5 bg-gray-50 focus-within:border-blue-400 transition-colors'>
                    <div className="bg-blue-100 p-2 rounded-full flex items-center justify-center">
                        <img
                            src={assets.lock_icon}
                            alt=""
                            className="w-5 h-5 object-contain"
                        />
                    </div>
                    <input
                        type="password"
                        onChange={e => setPassword(e.target.value)}
                        value={password}
                        className='outline-none text-sm bg-transparent flex-1'
                        placeholder='Password'
                        required
                    />
                </div>

                <p
                    className='text-sm text-blue-600 my-4 cursor-pointer'
                    onClick={handleForgotPasswordClick}
                >
                    Forgot password?
                </p>

                <button
                    className=" cursor-pointer bg-blue-600 w-full text-white py-2 rounded-full 
             transition transform active:scale-95 duration-100"
                >
                    {state === 'Login' ? 'Login' : 'Create Account'}
                </button>


                {state == 'Login' ? <p className='mt-5 text-center'>Don't have an account? <span onClick={() => (setState('Sign Up'))} className='text-blue-600 cursor-pointer'>Signup</span></p> :
                    <p className='mt-5 text-center'>Already have an account? <span onClick={() => (setState('Login'))} className='text-blue-600 cursor-pointer'>Login</span></p>}

                <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" className='absolute top-5 right-5 cursor-pointer' />
            </motion.form>
        </div>
    )
}

export default Login
