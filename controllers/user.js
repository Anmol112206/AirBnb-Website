const User = require("../models/user");

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
}
module.exports.signup = async (req,res)=>{
    try{
        let {username,email,password} = req.body;
        const newUser = new User({email,username});
        const registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err)=>{  //automaticalyy got logged in when signed up
            if(err) return next(err);
            req.flash("success","Welcome to WanderLust!");
            res.redirect("/listings");
        })  
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}
module.exports.login = async (req,res)=>{
    req.flash("success","Welcome back to Wanderlust!");
    let redirectUrl = res.locals.redirectUrl  || "listings";   //in case login from home page it gives error so to tackle out
    res.redirect(redirectUrl);
}
module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err) return next(err);
        req.flash("success","you are logged out");
        res.redirect("/listings");
    });
}