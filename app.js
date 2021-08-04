
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

//COOKIE PARSER
app.use(cookieParser());
 
// BODY PARSER
app.use(express.json());
app.use(express.urlencoded({extended: true}))

// SETTING VIEW ENGIEN
app.set("views", path.join(__dirname, 'view'));
app.set("view engine", 'ejs');
app.engine('ejs', require('ejs-locals'));

// CONNECTING TO DATABASE
mongoose.connect('mongodb+srv://dalveersidhu97:3q5vThotLgTVhePS@cluster0.v2aom.mongodb.net/ProjectsDB?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true});
    const db =mongoose.connection;
    db.on('error',console.error.bind(console,'Connection error'));
    db.once('open',function(){
    console.log("we are connected on mongoose");
});

// ROUTERS
const projectRouter = require('./routers/projectRoutes');
const taskRouter = require('./routers/taskRoutes');
const userRouter = require('./routers/userRoutes');

app.use('/project', projectRouter);
app.use('/projects', projectRouter);
app.use('/user', userRouter);
app.use('/tasks', taskRouter);

app.all('/', (req, res)=>{
    res.redirect('/projects');
})

// ERROR HANDELER
app.use((err, req, res, next) =>{
    console.log(err);
    return res.send(err.message);
});

// SERVER
app.listen('80');