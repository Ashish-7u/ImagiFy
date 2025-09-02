import userModel from "../models/userModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import razorpay from 'razorpay'
import transactionModel from "../models/transactionModel.js"
import crypto from 'crypto';
import nodemailer from 'nodemailer';


const registerUser = async(req , res )=>{
    try {
        const {name,email,password}= req.body;

        if(!name || !email || !password){
            return res.json({success:false,message:'Missing Details'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)

        const userData = {
            name, 
            email,
            password:hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id:user._id},process.env.JWT_SECRET)

        res.json({success:true,token,user:{name:user.name}})
    } catch (error) {

        console.log(error)
        res.json({success:false,message:error.message})
        
    }






}

    // login

    const loginUser = async (req,res)=>{
        try {

            const {email, password} = req.body;
            const  user = await userModel.findOne({email})

              if(!email||!password){
                return res.json({success:false,messeage:'Missing details'})
            }

            if(!user){
                return res.json({success:false,message:'User doesnot exist'})
            }

            const isMatch = await bcrypt.compare(password,user.password)

            if(isMatch){
                   const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
                   res.json({success:true,token,user:{name:user.name}})

            }else{

                return res.json({success:false,messeage:'Invalid credential'})

            }

          
            
        } catch (error) {
        
        console.log(error)
        res.json({success:false,message:error.message})
        
            
        }
    }



    const userCredits = async(req,res)=>{
        try {
           const userId = req.userId;
            const user = await userModel.findById(userId)
            res.json({success:true,credits:user.creditBalance,user:{name:user.name}})
        } catch (error) {
            console.log(error.message)
            res.json({success:false,message:error.message})
        }
    }

    //razorpay cntrlr

    const razorpayInstance = new razorpay({
        key_id:process.env.RAZORPAY_KEY_ID,
        key_secret:process.env.RAZORPAY_KEY_SECRET,
        
        
    });

    const paymentRazorpay = async(req,res)=>{
        try {

            const {planId} = req.body
            const userId = req.userId;

            const userData = await userModel.findById(userId)

            if(!userId || !planId){
                return res.json({success:false,message:"Missing Details"})

            }
            let credits,plan,amount,date

            switch (planId) {
                case 'Basic':
                    plan = 'Basic'
                    credits=100
                    amount=10
                    
                    break;
                
                case 'Advanced':
                    plan = 'Advanced'
                    credits=500
                    amount=50
                    
                    break;


                case 'Business':
                    plan = 'Business'
                    credits=5000
                    amount=250
                    
                    break;
            
                default:
                    return res.json({success:false,message:'Plan not found'});
                    
            }

            date = Date.now();

            const transactionData = {
                userId, plan , amount, credits,date
            }

            const newTransaction = await transactionModel.create(transactionData)

            const options = {
                amount:amount*100,
                currency:process.env.CURRENCY,
                receipt:newTransaction._id,
            }

            await razorpayInstance.orders.create(options,(error,order)=>{

                if(error){
                    console.log(error);
                    return res.json({success:false,message:error})
                }
                res.json({success:true,order})

            })
            
        } catch (error) {
            console.log(error)
            res.json({success:false,message:error.message})
        }
    }


    const verifyRazorpay = async(req,res)=>{
        try {

            const {razorpay_order_id} = req.body;

            const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

            if(orderInfo.status === 'paid'){
                const transactionData = await transactionModel.findById(orderInfo.receipt)
                if(transactionData.payment){
                    return res.json({success:false,message:'payment Failed'})
                }

                const userData = await userModel.findById(transactionData.userId)

                const creditBalance = userData.creditBalance + transactionData.credits

                await userModel.findByIdAndUpdate(userData._id,{creditBalance})

                await transactionModel.findByIdAndUpdate(transactionData._id,{payment:true})

                res.json({success:true,message:"Credits Added"})
            }else{
                res.json({success:false,message:"Payment Failed"})
            }

            
        } catch (error) {
             console.log(error)
            res.json({success:false,message:error.message})

        }
    }




    // 1. Forgot Password — generate reset token and send email
const forgotPassword = async (req, res) => {
  try {
    const {email } = req.body;
    if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User does not exist' });

    const resetToken = crypto.randomBytes(32).toString('hex');

    // Store hashed token + expiry in DB
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send email with reset link (adjust nodemailer config per your setup)
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: 'Password Reset Request',
      html: `<p>You requested to reset your password.</p><p>Click <a href="${resetUrl}">here</a> to reset it. Link expires in 30 minutes.</p>`
    });

    res.json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// 2. Reset Password — validate token and update password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) return res.status(400).json({ success: false, message: 'Password is required' });

    // Hash the received token to compare with stored hashed token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() } // token not expired
    });

    if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });

    // Hash new password and update user document
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Remove reset token fields after successful password reset
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};




    export { registerUser, loginUser,userCredits,paymentRazorpay,verifyRazorpay,forgotPassword,resetPassword };
