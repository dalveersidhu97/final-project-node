
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');

// CONTROLLERS
const projectController = require('./controller/projectController');
const taskController = require('./controller/taskController');
const userController = require('./controller/userController');

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
const projectRouter = express.Router();
const taskRouter = express.Router({mergeParams: true});
const userRouter = express.Router();

app.use('/project', projectRouter);
app.use('/projects', projectRouter);
app.use('/user', userRouter);
app.use('/tasks', taskRouter);
projectRouter.use('/:projectId/task', taskRouter);

// MIDDLEWARE LOGIN
projectRouter.use(userController.isLoggedIn);
taskRouter.use(userController.isLoggedIn); 

// PROJECT ROUTES
projectRouter
     // for /projects
    .get('/', userController.isLoggedIn ,projectController.getAllProjects)
    .get('/completed-projects', userController.isLoggedIn, projectController.filterCompleteProjects, projectController.getAllProjects)
    .get('/incomplete-projects', userController.isLoggedIn, projectController.filterInompleteProjects, projectController.getAllProjects)
     // for /project
    .get('/insert', projectController.projectInsertForm)
    .get('/:projectId', projectController.getProject)
    .get('/:projectId/update', projectController.projectUpdateForm)
    .post('/:projectId/update', projectController.updateProject)
    .post('/insert', projectController.insertProject)
    .delete('/:projectId', projectController.deleteProject)
    .get('/:projectId/delete', projectController.deleteProject);

// TASK ROUTES
taskRouter
    .get('/', taskController.getAllTasks)
    .get('/insert', taskController.taskInsertForm)
    .post('/insert', taskController.insertTask)
    .get('/incomplete-tasks', taskController.filterIncompleteTasks, taskController.getAllTasks)
    .get('/complete-tasks', taskController.filterCompleteTasks, taskController.getAllTasks)
    .get('/:taskId', taskController.getProjectTask)
    .get('/:taskId/update', taskController.taskUpdateForm)
    .post('/:taskId/update', taskController.updateTask)
    .get('/:taskId/complete', taskController.completeTask)
    .get('/:taskId/delete-task', taskController.deleteTask)
    .delete('/:taskId/delete-task', taskController.deleteTask)
    
// USER ROUTES
userRouter
    .get('/register', userController.userRegisterForm)
    .get('/login', userController.userLoginForm)
    .get('/logout', userController.logoutUser)
    .post('/register', userController.registerUser)
    .post('/login', userController.loginUser)

// ERROR HANDELER
app.use((err, req, res, next) =>{
    console.log(err);
    return res.send(err.message);
});

// SERVER
app.listen('80');