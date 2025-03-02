var express = require('express');
var router = express.Router();
const controller=require('../contoller/parentController')
const childcontroller=require('../contoller/childController')
const adminController=require('../contoller/adminController')
const appsettings=require('../contoller/appsettingcontroller')
const verifytoken=require('../middleware/jwtVerification');
const {getAllbookingController, bookTimeSlotsController,getbookingbyidcontroller,getbookingByparentidcontroller,getbookingallcontroller, sendEmailpayment, updatepaymentcontrol}= require('../contoller/bookingController');
const { updatePayment } = require('../model/bookModel');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/test', (req, res) => {
  res.json({ message: 'API working!' });
});
router.post('/register',controller.parentRegController)
router.post('/login',controller.parentLoginController)
router.post('/update',verifytoken,controller.parentUpdateController)
router.post('/emailstatus',verifytoken,controller.parentEmailStatus)
router.post('/sendotp',verifytoken,controller.parentSendEmail)
router.post('/verifyotp',verifytoken,controller.validateOtp)
router.post('/userdetails',verifytoken,controller.getUserdetails)
router.post('/getalldata',verifytoken,controller.getUsersAllandChild)
router.post('/sendotpEmail',controller.forgotPassword)
router.post('/verifysendotp',controller.VerifyOtp)
router.post('/changepassword',controller.ChangePassword)
// child route
router.post('/childadd',verifytoken,childcontroller.RegChildcontroller)
router.post('/childrecord',verifytoken,childcontroller.getChilddata)
router.post('/childremove',verifytoken,childcontroller.deleteChildrecord)
router.post('/childupdate',verifytoken,childcontroller.childUpdateController)
router.post('/childallrec',verifytoken,childcontroller.childallrecordcontroller)
//booking route
router.post('/getavailablehour',verifytoken,getAllbookingController)
router.post('/insertbook',verifytoken,bookTimeSlotsController)
router.post('/getbook',verifytoken,getbookingbyidcontroller)
router.post('/getbookbyparentid',verifytoken,getbookingByparentidcontroller)
router.post('/getallbook',verifytoken,getbookingallcontroller)
router.post('/sendemail',verifytoken,sendEmailpayment)
//admin route
router.post('/registeradmin',adminController.AdminRegController)
router.post('/adminlogin',adminController.AdminLoginController)
router.post('/getnofkidsperhour',verifytoken,appsettings.getnumberall)
router.post('/addnumberofkidsperhour',verifytoken,appsettings.insertnumbercontroller)
router.post('/addrate',verifytoken,appsettings.getratecontroller)
router.post('/getrateall',verifytoken,appsettings.getrateall)
router.post('/getratebygroup',verifytoken,appsettings.getrate)
router.post('/insertbankdetails',verifytoken,appsettings.bankdetails);
router.post('/getbankdetails',verifytoken,appsettings.getbankdetailcontroller)
router.post('/contactcenter',appsettings.insertcontactcontroller)
router.post('/updatepayment',verifytoken,updatepaymentcontrol)





module.exports = router;
