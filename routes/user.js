const express=require('express');
const wrapAsync = require('../utils/wrapAsync');
const router=express.Router();
const passport=require('passport');
const { saveRedirectUrl } = require('../middleware.js');
const usercontroller=require("../controllers/user.js");

router.get("/signup",usercontroller.renderSignupForm);

router.post("/signup",wrapAsync(usercontroller.signup));


router.get("/login",usercontroller.renderLoginForm);


router.post("/login",saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login' ,failureFlash:true}),usercontroller.login);

  router.get("/logout",usercontroller.logout);


module.exports=router;