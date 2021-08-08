
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

module.exports = app;