const AdminModel=require('../model/adminModel')
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken')
const transporter=require('../services/emailconfig')
const VerifyTemplate=require('../services/emailtemplate')

 const AdminRegController=async(req,res)=>{
    await AdminModel.createTableAdmin()
    const email=process.env.ADMIN_EMAIL
    const password=process.env.ADMIN_PASSWORD
   
    // const hashedPassword = await bcrypt.hash(password, 8);
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
  
      // const passwordIsValid = bcrypt.compareSync(password, getrows.password);
      // if (!passwordIsValid) {
      //   return res.status(401).json({ auth: false, token: null, message: "Invalid password." });
      // }
  
      const token = jwt.sign({ id: getrows.id }, process.env.SECRET_KEY, { expiresIn: 86400 }); // 24 hours
      res.status(200).json({ auth: true, token });
  
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  const UploadTestimony = async (req, res) => {
    try {
        const { name, testimony } = req.body;
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Image is required' });
        }

        const filename = req.file.filename;

        const insertId = await AdminModel.insertTestimony(name, testimony, filename);

        res.status(201).json({ 
            success: true, 
            message: 'Testimony uploaded successfully', 
            data: { id: insertId, name, testimony, image: filename } 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const getTestimony = async (req, res) => {
  try {
      const testimonies = await AdminModel.getTestimonies();

      res.status(200).json({
          success: true,
          message: 'Testimonies retrieved successfully',
          data: testimonies
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
const deleteTestimony = async (req, res) => {
  try {
      const { id } = req.body; // Extract ID from request body
      if (!id) {
          return res.status(400).json({ success: false, message: 'Testimony ID is required' });
      }

      const deletedRows = await AdminModel.deleteTestimonyById(id);

      if (deletedRows === 0) {
          return res.status(404).json({ success: false, message: 'Testimony not found' });
      }

      res.status(200).json({
          success: true,
          message: 'Testimony deleted successfully',
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports={
    AdminRegController,
    AdminLoginController,
    UploadTestimony,
    getTestimony,
    deleteTestimony,
}