const appsettingmodel=require('../model/appSettingModel')
const transporter = require('../services/emailconfig')
const { ContactEmail } = require('../services/emailtemplate')

const getratecontroller=async(req,res)=>{
    const {agegroup,rate}=req.body
    try{
        const result=await appsettingmodel.insertamountrate(agegroup,rate)
        if(result.message==='successful'){
            res.status(201).json({message:'data updated'})
        }

    }catch(error){
        res.status(500).json({ message: error.message });

    }
   

}
const insertnumbercontroller=async(req,res)=>{
    const {noofkids}=req.body
    try{
        const result=await appsettingmodel.insertkidnumber(noofkids)
        if(result.message==='successful'){
            res.status(201).json({message:'data updated'})
        }

    }catch(error){
        res.status(500).json({ message: error.message });

    }
   

}
const getrateall=async(req,res)=>{
    try{
        const row=await appsettingmodel.getamountrateall()
        if(row.length>0){
            res.status(201).json({message:'data updated',data:row})

        }
        else{
            res.status(404).json({message:'no record found'})
            return
        }


    }
    catch(error){
        res.status(500).json({ message: error.message });

    }

}
const getrate=async(agegroup)=>{
    
    try{
        const row=await appsettingmodel.getamountrate(agegroup)
        if(row.length>0){
           return {message:'data updated',data:row}

        }
        else{
           
            return
        }


    }
    catch(error){
        res.status(500).json({ message: error.message });

    }

}
const getnumberall=async(req,res)=>{
    try{
        const row=await appsettingmodel.getnoofkid()
        if(row.length>0){
            res.status(201).json({message:'data updated',data:row})

        }
        else{
            res.status(404).json({message:'no record found'})
            return
        }


    }
    catch(error){
        res.status(500).json({ message: error.message });

    }

}
const bankdetails=async(req,res)=>{
    const {bankname,accountno,sortcode}=req.body
    try{
        const result=await appsettingmodel.insertBankdetail(bankname,accountno,sortcode)
        if(result.message==='successful'){
            res.status(201).json({message:'data updated'})
        }

    }catch(error){
        res.status(500).json({ message: error.message });

    }
   

}
const getbankdetailcontroller=async(req,res)=>{
    try{
        const row=await appsettingmodel.getbankdetails()
        if(row.length>0){
            res.status(201).json({message:'data updated',data:row})

        }
        else{
            res.status(404).json({message:'no record found'})
            return
        }


    }
    catch(error){
        res.status(500).json({ message: error.message });

    }

}
const insertcontactcontroller=async(req,res)=>{
    const {fullname,email,subject,message}=req.body
    try{
        const result=await appsettingmodel.insertdatacenter(fullname,email,subject,message)
        const mailOptions = {
            from: 'miresumiresume@gmail.com',
            to: email,
            subject: 'Contact  Center',
            html: ContactEmail(fullname,email,subject,message),
          };   
        transporter.sendMail(mailOptions, async(error, info) => {
            if (error) {
              console.error(error);
             
              res.status(500).json({message:'Error sending email'});
            } else {
                if(result.message==='successful'){
                    res.status(201).json({message:'data updated'})
                }
              console.log('Email sent: ' + info.response);
              res.status(200).json({message:'Email sent'});
              
            }
          });
    }catch(error){
        res.status(500).json({message: error.message});
    }
}
module.exports={
    insertnumbercontroller,
    getrate,
    getrateall,
    getratecontroller,
    getnumberall,
    bankdetails,
    getbankdetailcontroller,
    insertcontactcontroller,
}