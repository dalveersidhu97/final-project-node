
const mongoose = require('mongoose');


const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();

//COOKIE PARSER
app.use(cookieParser());
 
// STATIC FILES
app.use('/favicon', express.static(path.join(__dirname, 'favicon')))

// BODY PARSER
app.use(express.json());
app.use(express.urlencoded({extended: true}))

// SETTING VIEW ENGIEN
app.set("views", path.join(__dirname, 'view'));
app.set("view engine", 'ejs');
app.engine('ejs', require('ejs-locals'));

// ROUTERS
app.use('/project', require('./routers/projectRoutes'));
app.use('/projects', require('./routers/projectRoutes'));
app.use('/user', require('./routers/userRoutes'));
app.use('/tasks', require('./routers/taskRoutes'));

app.all('*', (req, res)=>{
    res.redirect('/projects');
})

// ERROR HANDELER
app.use((err, req, res, next) =>{
    console.log(err);
    return res.send(err.message);
});


// CONNECTING TO DATABASE
mongoose.connect('mongodb+srv://dalveersidhu97:3q5vThotLgTVhePS@cluster0.v2aom.mongodb.net/ProjectsDB?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true});
    const db =mongoose.connection;
    db.on('error',console.error.bind(console,'Connection error'));
    db.once('open',function(){
    console.log("we are connected on mongoose");
});

// PORT
const PORT = process.env.PORT || 3000;

// SERVER
app.listen(PORT);