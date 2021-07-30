const Project = require("../model/project");
const Task = require("../model/task");
const catchAsync = require('../utils/catchAsync')

exports.getAllTasks = async (req, res) => {

    let filter =  {};
    let title = "All tasks";

    if(req.filter!=undefined) {
        filter = req.filter;
        title=req.title;
    }
    
    if(req.user.role == 'user') 
        Object.assign(filter, {user: req.user});

    let tasks = await Task.find(filter).populate("project").sort({"dueDate": 1});

    res.render('task/taskList', {"user": req.user, title, tasks});
}

exports.filterIncompleteTasks = async (req, res, next) => {
    req.filter = {"status": "incomplete"};
    req.title = "Incomplete tasks";
    next();
}

exports.filterCompleteTasks = async (req, res, next) => {
    req.filter = {"status": {"$ne":"incomplete"}};
    req.title = "Completed tasks";
    next();
}


exports.insertTask = async (req, res) => {
    
    if(!req.body.user || req.body.user.trim() == '')
        delete req.body.user;
    console.log(req.body);
    // insert task
    Task.create(req.body).then(task=> {

        res.redirect(`/project/${task.project}`);

    }).catch(err=>{

        console.log(err.message);
        res.render("task/taskForm", {errorMessage: err.message, title: 'Add task', "user": req.user});
    });
}

exports.updateTask = async (req, res) => {
    
    if(!req.body.user || req.body.user.trim() == '')
        delete req.body.user;
    console.log(req.body);
    // update task
    Task.findByIdAndUpdate(req.body.taskId, req.body).then(task=> {

        res.redirect(`/project/${task.project}`);

    }).catch(err=>{

        console.log(err.message);
        res.render("task/taskUpdateForm", {errorMessage: err.message, title: 'Update task', "user": req.user});
    });
}

exports.deleteTask = async (req, res) => {
    await Task.deleteMany({"_id": req.params.taskId});
    res.redirect(`/tasks`);
}

exports.taskInsertForm = catchAsync(async (req, res)=>{
    
    const project = await Project.findById(req.params.projectId).populate('members');
    res.render("task/taskForm", {title: "Add task", 'errorMessage':undefined, project, "user": req.user});

});

exports.taskUpdateForm = catchAsync(async (req, res)=>{
    const task = await Task.findById(req.params.taskId);
    const project = await Project.findById(req.params.projectId).populate('members');
    res.render("task/taskUpdateForm", {title: "Update task", 'errorMessage':undefined, project, task, "user": req.user});

});

exports.completeTask = async (req, res) => {
    await Task.findByIdAndUpdate(req.params.taskId, {"$set": {"status": "completed"}});
    res.redirect(`/project/${req.params.projectId}`);
}

exports.getProjectTask = async (req, res) => {
    
    const task = await Task.findById(req.params.taskId).populate('user');
    const project = await Project.findById(req.params.projectId).populate('members');
    console.log("hererer herhehehrhe");
    res.render("task/taskDetail", {title: "Task detail", 'errorMessage':undefined, project, task, "user": req.user});
}


