const express = require("express");
const mongoose = require("mongoose");
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const app = express();
require('./config/passport')(passport);

mongoose.connect("mongodb://localhost:27017/CRM",{useNewUrlParser:true, useUnifiedTopology:true});
app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");
app.use(express.urlencoded({extended:false}));
//Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use("/",require("./routes/index"));
app.use("/users",require("./routes/users"));

app.listen(3000,function(){
	console.log("Server has started on port 3000");
});