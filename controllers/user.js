const User=require('../model/user.js');

module.exports.renderSignupForm=(req,res)=>{
    res.render("user/signup.ejs");
    };

    module.exports.signup=async(req,res)=>{
        try{
            console.log("POST /signup");
          let {username , email, password}=req.body;
          const newUser= new User({email,username});
          const registeredUser= await User.register(newUser,password);
          console.log(registeredUser);
          req.login(registeredUser,(err)=>{
            if(err){
              return next(err);
            }
            req.flash("success","Welcome to WanderWave");
          res.redirect("/listings");
    
          })
          
        }
        catch(e){
          req.flash("error",e.message);
          res.redirect("/signup");
        }
    };

    module.exports.renderLoginForm=(req,res)=>{
        res.render("user/login.ejs");
        };

        module.exports.login=async(req,res)=>{
            req.flash("success","Welcome back to WanderWave!");
            redirectUrl=res.locals.redirectUrl || "/listings";
            res.redirect(redirectUrl);
              };
 module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
      if(err){
        return next(err);
      }
     req.flash("success","Successfully logged out!");
     res.redirect("/listings");

    });
  };             