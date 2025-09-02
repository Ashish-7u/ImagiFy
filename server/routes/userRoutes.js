import express from 'express'

import {registerUser , loginUser, userCredits, paymentRazorpay, verifyRazorpay,forgotPassword,resetPassword} from '../controllers/userController.js'
import userModel from '../models/userModel.js'
import userAuth from '../middlewares/auth.js'

const userRouter = express.Router()

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/credits',userAuth,userCredits)
userRouter.post('/pay-razor',userAuth,paymentRazorpay)
userRouter.post('/verify-razor',userAuth,verifyRazorpay)
userRouter.post('/forgot-password', forgotPassword)
userRouter.post('/reset-password/:token', resetPassword)


export default userRouter
