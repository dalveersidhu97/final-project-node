const User = require("../model/user");
const catchAsync = require('../utils/catchAsync')


exports.getUserList = async (selection) => {
    
    try {
        return await User.find(selection);
    }catch(err) {
        console.log(err);
        return [];
    }
};

exports.userRegisterForm = (req, res)=>{
    res.render("user/userRegisterForm", {errorMessage:undefined, "user":undefined});
}

exports.registerUser = (req, res) =>{

    User.create(req.body).then(user=>{
        console.log(user);
        res.redirect("/user/login");
    }).catch(err=>{
        res.render("user/userRegisterForm", {errorMessage: err.message, "user":undefined});
    });
}

exports.userLoginForm = async (req, res) => {
    return res.render("user/userLoginForm", {errorMessage: undefined, "user":undefined});
}

exports.loginUser = catchAsync(async (req, res) => {
    
    const user = await User.findOne(req.body);

    if(!user)
        return res.render("user/userLoginForm", {errorMessage: 'Incorect email or password', "user":undefined});
        
    res.cookie('email', user.email);
    res.cookie('password', user.password);
    return res.redirect("/projects");
    
});

exports.logoutUser = (req, res) => {
    res.cookie('email', "", {maxAge: Date.now()});
    res.cookie('password', "", {maxAge: Date.now()});
    return res.redirect("/user/login");
}

exports.isLoggedIn = catchAsync(async (req, res, next) => {
   
    const user = await User.findOne({'email':req.cookies.email, 'password':req.cookies.password});
    if(!user){
        console.log("///////////////// NOT LOGGED IN ////////////////")
        return res.redirect('/user/login');
    }
    console.log("///////////////// LOGGED IN ////////////////")
    req.user = user;
    next();
});


exports.adminOnly = catchAsync(async (req, res, next) => {
   
    if(req.user.role != 'admin')
        return res.redirect('/user/login');
        
    next();

});