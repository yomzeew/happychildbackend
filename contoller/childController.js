const childModel=require('../model/childModel')
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken')
const transporter=require('../services/emailconfig')
const VerifyTemplate=require('../services/emailtemplate')

const RegChildcontroller=async(req,res)=>{
    const {firstname,lastname,dob,age,agegroup,gender,assistance}=req.body
    const parentid=req.userId
    console.log(req.body)
    console.log(parentid)
   
    try{
        await childModel.createTableChild()
        const insert=await childModel.insertChild(firstname,lastname,parentid,dob,age,agegroup,gender,assistance)
        console.log(insert)
        res.status(201).json({ id:parentid,message:'successful', });
    }
    catch(error){
        console.log(error)
    }
}
const getChilddata=async(req,res)=>{
    const parentid=req.userId
    const selectdata=await childModel.getchildByparentid(parentid)
    console.log(selectdata)
    if(selectdata.length>0){
        return res.status(201).json({data:selectdata})
    }
    else{
        return res.status(404).json({ auth: false, message: 'Record not found.' });
    }




}
const deleteChildrecord=async(req,res)=>{
    const {id}=req.body
const deleteResult=await childModel.deleteChild(id)
console.log(deleteResult)
try{
if (deleteResult=== 1) {
    res.status(200).json({ message: 'Child record deleted successfully', deletedCount: deleteResult.deletedCount });
} else {
    res.status(404).json({ message: 'Child record not found' });
}
} catch (error) {
console.error(error);
res.status(500).json({ message: 'An error occurred while deleting the child record', error: error.message });
}

}
const childUpdateController=async(req,res)=>{
    const {firstname,lastname,dob,age,agegroup,gender,assistance,id}=req.body
    console.log(req.body)
    try{
    const updateuser=await childModel.updateChild(firstname,lastname,dob,age,agegroup,gender,assistance,id)
    if (updateuser === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.status(200).json({ message: 'User updated' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to update user' });
    }
 

}
const childallrecordcontroller=async(req,res)=>{
    try{
        const getrows=await childModel.getAllChild()
        if(!getrows){
          return res.status(404).json({ auth: false, message: 'No user found.' });
      }
      else{
        console.log(getrows)
        res.status(200).json({ data:getrows,message:'user found'});
      
      }

   } catch (error) {
      res.status(500).json({ error: 'Failed to update user' });
    }
}
module.exports={
    RegChildcontroller,
    getChilddata,
    deleteChildrecord,
    childUpdateController,
    childallrecordcontroller
}