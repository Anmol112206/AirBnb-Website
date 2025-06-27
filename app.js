if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const method = require('method-override');
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const MongoStore  = require('connect-mongo');
const flash = require("connect-flash");


const passport = require("passport");
const LocalStrategy = require("passport-local");


const User = require("./models/user.js");

//Parsing the cookies into a secret string keeping track of signing of users
app.use(cookieParser("secretcode"));

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));  //pparses only url encoded things not file type things
//Setting ejs mate to render ejs files and using method to use patch,delete...
app.use(method("_method"));
app.engine('ejs',ejsMate);

//const dbUrl = process.env.ATLASDB_URL;
const dbUrl = "mongodb://127.0.0.1:27017/wanderlust";
main()
    .then(()=>{
        console.log("connection successful");
    })
    .catch((err) => console.log(err));


async function main() {
  await mongoose.connect(dbUrl);   //by default connect to test database
}

app.get("/getsignedcookies",(req,res)=>{
    res.cookie("color","yellow", {signed:true});
    res.send("signed cookies sent");
});

app.get("/verify",(req,res)=>{
    console.log(req.cookies);  //prints all unsigned cookies
    console.log(req.signedCookies);
    res.send("verified");
});

app.get("/getcookies",(req,res)=>{
    res.cookie("greet","hello");
    res.cookie("greet","hello");
    res.send("sent you some cookies");
});

const store = MongoStore.create({
    mongoUrl : dbUrl,
    crypto:{
        secret : process.env.SECRET,
    },
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave:false,
    saveUninitialised:true,
    cookie:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
    }
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());  //web application needs the ability to identify users as they browse from page to page
//series of requests and responses each associated with same user 
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //to storing all info related to user
passport.deserializeUser(User.deserializeUser()); //to remove all info related to user


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);


app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode=500, message="something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{err});
});

app.listen("8080" , ()=>{
    console.log("server is running");
});