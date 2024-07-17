const userModel=require('../model/userModel')
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken')
const transporter=require('../services/emailconfig')
const VerifyTemplate=require('../services/emailtemplate')
 const parentRegController=async(req,res)=>{
    await userModel.createTable()
    const {email,password}=req.body
    const verificationstatus=false
    const checkEmail=await userModel.getUserByEmail(email)
    if(checkEmail){
      res.status(401).json({ auth: false, token: null, message: 'Email already exist.' });
      return
    }
   
    const hashedPassword = await bcrypt.hash(password, 8);
    try{
        const userId = await userModel.insertUser(email, hashedPassword,verificationstatus);
        res.status(201).json({ id: userId,message:'successful' });
    }
    catch(error){
        console.log(error)
    }

}
const parentLoginController=async(req,res)=>{
  await userModel.createTable()
    const SECRET_KEY = process.env.SECRET_KEY; 
    const {email,password}=req.body
    const getrows=await userModel.getUserByEmail(email)
    if(!getrows){
        return res.status(404).json({ auth: false, message: 'No user found.' });
    }
    const passwordIsValid = bcrypt.compareSync(password, getrows.password);
    if (!passwordIsValid) {
      return res.status(401).json({ auth: false, token: null, message: 'Invalid password.' });
    }
    const token = jwt.sign({ id: getrows.id }, SECRET_KEY, { expiresIn: 86400 }); // 24 hours
    res.status(200).json({ auth: true, token });
} 
const parentUpdateController=async(req,res)=>{
    const userid=req.userId
    const {firstname,lastname,occupation,address,phonenumber}=req.body
    try{
    const updateuser=await userModel.updateUser(userid,firstname,lastname,occupation,address,phonenumber)
    if (updateuser === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(200).json({ message: 'User updated' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user' });
    }
 

}
const parentSendEmail=async(req,res)=>{
  const userId=req.userId
  const getrow=await userModel.getUserById(userId)
  const email=getrow.email
  console.log(getrow)
  function generateRandom6DigitNumber() {
    return Math.floor(Math.random() * 9000) + 1000;
  }
  const otp=generateRandom6DigitNumber()
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes from now
  //update opt
  const mailOptions = {
    from: 'miresumiresume@gmail.com',
    to: email,
    subject: 'Email Verification',
    html: VerifyTemplate(otp),
  }; 
transporter.sendMail(mailOptions, async(error, info) => {
    if (error) {
      console.error(error);
     
      res.status(500).json({message:'Error sending email'});
    } else {
      console.log('Email sent: ' + info.response);
      req.session.otp=otp
      req.session.expiretime=expiresAt
      const updateuser=await userModel.updateUser(userId,otp,expiresAt)
      if (updateuser === 0) {
        res.status(404).json({ error: 'Otp error' });
      } else {
        res.status(200).json({message:'Email sent'});
      }
      
    }
  });
 }
 const validateOtp = async(req, res) => {
  const id=req.userId
  const { otp } = req.body;
  const getrows=await getUserById(id)
  const userotp=getrows.otp
  const userexpireAt=getrows.expiresAt

  if (!userotp || !userexpireAt) {
    return res.status(400).json({ message: 'No OTP found' });
  }

  if (Date.now() > userexpireAt) {
    return res.status(400).json({ message: 'OTP has expired' });
  }

  if (otp == userotp) {
    //update status
    const verifcationstatus=1
    const updateuser=await userModel.updateUserStatus(id,verifcationstatus)
    if (updateuser === 0) {
      return res.status(404).json({ error: 'User not found' });
    } else {
      return res.status(200).json({ message: 'OTP verified successfully' });
    }
  } else {
    return res.status(400).json({ message: 'Invalid OTP' });
  }
};



module.exports={
    parentLoginController,
    parentRegController,
    parentUpdateController,
    parentSendEmail,
    validateOtp
}