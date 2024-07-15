var express = require('express');
var router = express.Router();
const controller=require('../contoller/parentController')
const verifytoken=require('../middleware/jwtVerification')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.post('/register',controller.parentRegController)
router.post('/login',controller.parentLoginController)
router.post('/update',verifytoken,controller.parentUpdateController)
router.post('/sendotp',verifytoken,controller.parentSendEmail)
router.post('/verifyotp',verifytoken,controller.validateOtp)


module.exports = router;
