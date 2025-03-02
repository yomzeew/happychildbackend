const userModel=require('../model/userModel')
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken')
const transporter=require('../services/emailconfig')
const {VerifyTemplate}=require('../services/emailtemplate')
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
const parentEmailStatus=async(req,res)=>{
  const userId=req.userId
  const getrow=await userModel.getUserById(userId)
  const validstatus=getrow.verificationstatus
  if(validstatus==0){
    res.status(201).json({ message:false });

  }
  else{
    res.status(201).json({ message:true });

  }

  
}
const parentSendEmail=async(req,res)=>{
  const userId=req.userId
  const getrow=await userModel.getUserById(userId)
  const email=getrow.email
  console.log(email)
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
      const updateuser=await userModel.updateUserOtp(userId,otp,expiresAt)
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
  const getrows=await userModel.getUserById(id)
  const userotp=getrows.otp
  const userexpireAt=new Date(getrows.expireAt).getTime();
 
  if (!userotp || !userexpireAt) {
    return res.status(400).json({ message: 'No OTP found' });
  }

  if (Date.now() >Date.parse(getrows.expireAt)) {
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
const getUserdetails=async(req,res)=>{
  const userId=req.userId
  const getrows=await userModel.getUserByIDonly(userId)
  if(!getrows){
    return res.status(404).json({ auth: false, message: 'No user found.' });
}
else{
  res.status(200).json({ data:getrows,message:'user found'});

}


}
const getUsersAllandChild=async(req,res)=>{
  const getrows=await userModel.getAllUsersandChildmodel()
  if(!getrows){
    return res.status(404).json({ auth: false, message: 'No user found.' });
}
else{
  res.status(200).json({ data:getrows,message:'user found'});

}
}
const forgotPassword = async (req, res) => {
  try {
      const { email } = req.body;

      if (!email) {
          return res.status(400).json({ message: 'Email is required.' });
      }

      const getrows = await userModel.getUserByEmail(email);

      if (!getrows) {
          return res.status(404).json({ auth: false, message: 'No user found with the given email.' });
      }

      const userId = getrows.id;
      const otp = Math.floor(100000 + Math.random() * 900000);
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

      const mailOptions = {
          from: 'miresumiresume@gmail.com',
          to: email,
          subject: 'Email Verification',
          html: VerifyTemplate(otp), // Ensure VerifyTemplate function is properly defined
      };

      transporter.sendMail(mailOptions, async (error, info) => {
          if (error) {
              console.error('Error sending email:', error);
              return res.status(500).json({ message: 'Error sending email.' });
          } else {
              console.log('Email sent:', info.response);

              const updateUser = await userModel.updateUserOtp(userId, otp,  expiresAt.toISOString());
              if (updateUser === 0) {
                  return res.status(500).json({ error: 'Failed to update user OTP.' });
              }

              return res.status(200).json({ message: 'OTP sent successfully.' });
          }
      });
  } catch (error) {
      console.error('Error in forgotPassword:', error);
      return res.status(500).json({ error: 'Internal server error.' });
  }
};
const VerifyOtp = async (req, res) => {
  try {
      const { email, otp } = req.body;

      if (!email || !otp) {
          return res.status(400).json({ message: 'Email and OTP are required.' });
      }

      const getrows = await userModel.getUserByEmail(email);
      if (!getrows) {
          return res.status(404).json({ auth: false, message: 'No user found with the given email.' });
      }

      const { otp: userOtp, expireAt } = getrows;

      if (!userOtp || !expireAt) {
          return res.status(400).json({ message: 'No OTP found or it was not generated.' });
      }

      const expireAtTime = new Date(expireAt).getTime();
      const currentTime = Date.now();

      console.log('expireAt:', expireAt);
      console.log('Parsed expireAt:', expireAtTime);
      console.log('Current time:', currentTime);
      console.log('Time difference (ms):', expireAtTime - currentTime);

      // Check if OTP has expired
      // if (currentTime > expireAtTime) {
      //     return res.status(400).json({ message: 'OTP has expired' });
      // }

      // Validate OTP
      if (otp === userOtp) {
          return res.status(200).json({ message: 'OTP verified successfully.' });
      } else {
          return res.status(400).json({ message: 'Invalid OTP.' });
      }
  } catch (error) {
      console.error('Error in VerifyOtp:', error);
      return res.status(500).json({ error: 'Internal server error.' });
  }
};

const ChangePassword=async(req,res)=>{
try{
  const {email,newpassword}=req.body;
  if (!email || !newpassword) {
    return res.status(400).json({ message: 'Password are required.' });
}
const hashedPassword = await bcrypt.hash(newpassword, 8);
  const updateuser=await userModel.updatePassword(email,hashedPassword)
  if (updateuser === 0) {
     return res.status(404).json({ error: 'User not found' });
    } else {
      return res.status(200).json({ message: 'User updated' });
    }
 

}
 catch (error) {
      console.error('Error in VerifyOtp:', error);
      return res.status(500).json({ error: 'Internal server error.' });
  }
}




module.exports={
    parentLoginController,
    parentRegController,
    parentUpdateController,
    parentSendEmail,
    validateOtp,
    parentEmailStatus,
    getUserdetails,
    getUsersAllandChild,
    forgotPassword,
    VerifyOtp,
    ChangePassword
}