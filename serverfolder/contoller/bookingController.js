const { insertTime, bookTimeSlots,getAvailableHours,getbookingByid,getbookingByparentid, getbookingByall, updatePayment } = require('../model/bookModel');
const { getUserById } = require('../model/userModel');
const transporter  = require('../services/emailconfig')
const {  SendPayment, ConfirmPayment } = require('../services/emailtemplate')
const appsettingmodel=require('../model/appSettingModel')

function convertDateFormat(isoDate) {
    const date = new Date(isoDate);

    const day = date.getUTCDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getUTCFullYear();

    const getOrdinalSuffix = (n) => {
        if (n > 3 && n < 21) return 'th'; // Exceptions for 11th to 13th
        switch (n % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    const dayWithSuffix = day + getOrdinalSuffix(day);

    return `${dayWithSuffix}, ${month}, ${year}`;
}
function daysextend(days,originalTimestamp){
const dateObj = new Date(originalTimestamp);
const daysToAdd = parseInt(days);
dateObj.setDate(dateObj.getDate() + daysToAdd);
const newTimestamp = dateObj.toISOString();
console.log(newTimestamp)
return convertDateFormat(newTimestamp)
}
const getAllbookingController = async (req, res) => {
    try {
        // Fetch the intervals and their bookings from the database
        const availableHours = await getAvailableHours();
        res.status(200).json({data:availableHours});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const bookTimeSlotsController = async (req, res) => {
    const parent_id=req.userId
    const {child_id,phone_number, check_in, check_out, schedule_pattern, time_slots } = req.body;
    console.log(req.body)
    try {
        const result = await bookTimeSlots(child_id, parent_id, phone_number, check_in, check_out, schedule_pattern, time_slots);
        console.log(result)
        res.status(200).json({ message: 'Booking successful!',totalCost:result.totalCost,id:result.insertid });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getbookingbyidcontroller=async(req,res)=>{
    const {id}=req.body
    try{
        const row=await getbookingByid(id)
        res.status(200).json({data:row});

    }catch(error){
        res.status(500).json({ message: error.message });

    }
}
const getbookingByparentidcontroller =async(req,res)=>{
    const id=req.userId
    try{
        const row=await getbookingByparentid(id)
        res.status(200).json({data:row});

    }catch(error){
        res.status(500).json({ message: error.message });

    }
}
const getbookingallcontroller =async(req,res)=>{
    try{
        const row=await getbookingByall()
        res.status(200).json({data:row});

    }catch(error){
        res.status(500).json({ message: error.message });

    }
}
const sendEmailpayment=async(req,res)=>{
    const userid=req.userId
    const rowuser=await getUserById(userid)
    const email=rowuser.email
    const firstname=rowuser.firstname
    const {invoiceid,startdate,enddate,days}=req.body
    const row=await getbookingByid(invoiceid)
    const totalamount=row[0].amount
    const childfullname=row[0].child_fullname
    const rowbankdetails=await appsettingmodel.getbankdetails()
    const bankname=rowbankdetails[0].bankname
    const accountno=rowbankdetails[0].accountno
    const sortcode=rowbankdetails[0].sortcode
    const mailOptions = {
        from: 'miresumiresume@gmail.com',
        to: email,
        subject: 'Payment Details',
        html: SendPayment(invoiceid,startdate,enddate,days,totalamount,childfullname,bankname,accountno,sortcode,firstname),
      }; 
      
    transporter.sendMail(mailOptions, async(error, info) => {
        if (error) {
          console.error(error);
         
          res.status(500).json({message:'Error sending email'});
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).json({message:'Email sent'});
          
        }
      });

}
const updatepaymentcontrol=async(req,res)=>{
    const {id}=req.body
    const row=await getbookingByid(id)
    const startdate=convertDateFormat(row[0].created_at)
    const totalamount=row[0].amount
    const days=row[0].schedulepattern
    const enddate=daysextend(days,row[0].created_at)
    const childfullname=row[0].child_fullname
   
    const parentid=row[0].parentid
    const rowuser=await getUserById(parentid)
    const firstname=rowuser.firstname
    const email=rowuser.email
     //get updatepament
     const updatepayment=await updatePayment(id)
     if (updatepayment === 0) {
        res.status(404).json({ error: 'User not found' });
        return
      } else {
        const mailOptions = {
            from: 'miresumiresume@gmail.com',
            to: email,
            subject: 'Payment Confirm',
            html: ConfirmPayment(id,startdate,enddate,days,totalamount,childfullname,firstname),
          }; 
          
        transporter.sendMail(mailOptions, async(error, info) => {
            if (error) {
              console.error(error);
             
              res.status(500).json({message:'Error sending email'});
            } else {
              console.log('Email sent: ' + info.response);
              res.status(200).json({message:'successful'});
              
            }
          });
        
      }
   

   
  

}



module.exports = { getAllbookingController, bookTimeSlotsController,getbookingbyidcontroller,getbookingByparentidcontroller,getbookingallcontroller,sendEmailpayment,updatepaymentcontrol};
