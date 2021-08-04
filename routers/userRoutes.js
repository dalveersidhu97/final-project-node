const express = require('express');
const userController = require('../controller/userController');

const userRouter = express.Router({mergeParams: true});

// USER ROUTES
userRouter
    .get('/register', userController.userRegisterForm)
    .get('/login', userController.userLoginForm)
    .get('/logout', userController.logoutUser)
    .post('/register', userController.registerUser)
    .post('/login', userController.loginUser)

module.exports = userRouter;