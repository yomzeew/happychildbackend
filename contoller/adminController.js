const AdminModel=require('../model/adminModel')
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken')
const transporter=require('../services/emailconfig')
const VerifyTemplate=require('../services/emailtemplate')

 const AdminRegController=async(req,res)=>{
    await AdminModel.createTableAdmin()
    const email=process.env.ADMIN_EMAIL
    const password=process.env.ADMIN_PASSWORD
    const hashedPassword = await bcrypt.hash(password, 8);
    const checkEmail=await AdminModel.getAdminByEmail(email)
    if(checkEmail){
      res.status(401).json({ auth: false, token: null, message: 'Email already exist.' });
      return
    }
   
    try{
        // const 
        const AdminId = await AdminModel.insertAdmin(email, hashedPassword);
        res.status(201).json({ id: AdminId,message:'successful' });
    }
    catch(error){
        console.log(error)
    }

}
const AdminLoginController = async (req, res) => {
    try {
      await AdminModel.createTableAdmin();
      
      if (!req.body) {
        return res.status(400).json({ message: "Request body is missing." });
      }
  
      const { email, password } = req.body; // ✅ Ensure body is parsed
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
      }
  
      console.log("Login attempt for:", email);
  
      const getrows = await AdminModel.getAdminByEmail(email);
      if (!getrows) {
        await AdminRegController()
        return res.status(404).json({ auth: false, message: "No user found." });
      }
  
      const passwordIsValid = bcrypt.compareSync(password, getrows.password);
      if (!passwordIsValid) {
        return res.status(401).json({ auth: false, token: null, message: "Invalid password." });
      }
  
      const token = jwt.sign({ id: getrows.id }, process.env.SECRET_KEY, { expiresIn: 86400 }); // 24 hours
      res.status(200).json({ auth: true, token });
  
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
// const parentUpdateController=async(req,res)=>{
//     const userid=req.userId
//     const {firstname,lastname,occupation,address,phonenumber}=req.body
//     try{
//     const updateuser=await userModel.updateUser(userid,firstname,lastname,occupation,address,phonenumber)
//     if (updateuser === 0) {
//         res.status(404).json({ error: 'User not found' });
//       } else {
//         res.status(200).json({ message: 'User updated' });
//       }
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to update user' });
//     }
 

// }
// const parentEmailStatus=async(req,res)=>{
//   const userId=req.userId
//   const getrow=await userModel.getUserById(userId)
//   const validstatus=getrow.verificationstatus
//   if(validstatus==0){
//     res.status(201).json({ message:false });

//   }
//   else{
//     res.status(201).json({ message:true });

//   }

  
// }
// const parentSendEmail=async(req,res)=>{
//   const userId=req.userId
//   const getrow=await userModel.getUserById(userId)
//   const email=getrow.email
//   console.log(email)
//   function generateRandom6DigitNumber() {
//     return Math.floor(Math.random() * 9000) + 1000;
//   }
//   const otp=generateRandom6DigitNumber()
//   const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes from now
//   //update opt
//   const mailOptions = {
//     from: 'miresumiresume@gmail.com',
//     to: email,
//     subject: 'Email Verification',
//     html: VerifyTemplate(otp),
//   }; 
// transporter.sendMail(mailOptions, async(error, info) => {
//     if (error) {
//       console.error(error);
     
//       res.status(500).json({message:'Error sending email'});
//     } else {
//       console.log('Email sent: ' + info.response);
//       const updateuser=await userModel.updateUserOtp(userId,otp,expiresAt)
//       if (updateuser === 0) {
//         res.status(404).json({ error: 'Otp error' });
//       } else {
//         res.status(200).json({message:'Email sent'});
//       }
      
//     }
//   });
//  }
//  const validateOtp = async(req, res) => {
//   const id=req.userId
//   const { otp } = req.body;
//   const getrows=await userModel.getUserById(id)
//   const userotp=getrows.otp
//   const userexpireAt=new Date(getrows.expireAt).getTime();
 
//   if (!userotp || !userexpireAt) {
//     return res.status(400).json({ message: 'No OTP found' });
//   }

//   if (Date.now() >Date.parse(getrows.expireAt)) {
//     return res.status(400).json({ message: 'OTP has expired' });
//   }

//   if (otp == userotp) {
//     //update status
//     const verifcationstatus=1
//     const updateuser=await userModel.updateUserStatus(id,verifcationstatus)
//     if (updateuser === 0) {
//       return res.status(404).json({ error: 'User not found' });
//     } else {
//       return res.status(200).json({ message: 'OTP verified successfully' });
//     }
//   } else {
//     return res.status(400).json({ message: 'Invalid OTP' });
//   }
// };
// const getUserdetails=async(req,res)=>{
//   const userId=req.userId
//   const getrows=await userModel.getUserByIDonly(userId)
//   if(!getrows){
//     return res.status(404).json({ auth: false, message: 'No user found.' });
// }
// else{
//   res.status(200).json({ data:getrows,message:'user found'});

// }


// }


module.exports={
    AdminRegController,
    AdminLoginController,
}