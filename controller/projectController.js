const Project = require("../model/project");
const Task = require("../model/task");
const User = require("../model/user");
const catchAsync = require('../utils/catchAsync')
const userController = require('../controller/userController')
const mongoose = require('mongoose');
const project = require("../model/project");


exports.getAllProjects = catchAsync(async (req,res)=>{
    
    let projects;
    let title = "Your projects";
    let project = {};
    let filter = {};

    if(req.filter != undefined) Object.assign(filter, req.filter);

    if(req.user.role == 'user'){
        Object.assign(filter, {"members._id": req.user._id});

        projects = await Project.aggregate([
            {'$lookup': {"localField":'members', "foreignField": "_id", "from":"User", "as": "members"}},
            {'$unwind': '$members'},
            {'$match': {"members._id": req.user._id}}
        ]);
        project.tasks = await Task.find({"user": mongoose.Types.ObjectId(req.user._id)}).sort({"dueDate": 1});
    }else {// else for admin show all the projects
        projects = await Project.find(); title = "All projects";
        project.tasks = await Task.find().sort({"dueDate": 1});
    }

    for(let i=0;i<projects.length;i++){
        console.log(await getProjectProgress(projects[i]._id)+"%");
        projects[i].progress = await getProjectProgress(projects[i]._id)+"%";
        projects[i].tasks = await Task.find({"project": mongoose.Types.ObjectId(projects[i]._id)});
    }

    if(req.filterProgress!=undefined) projects = projects.filter(project=>req.filterProgress(project.progress));
    if(req.title!=undefined) title = req.title;

    return res.render("project/projectList", {title, projects, project, "user": req.user});
});

exports.filterCompleteProjects = (req, res, next) => {
    req.filterProgress = (progress)=>progress=='100%';
    req.title = "Completed projects";
    next();
}

exports.filterInompleteProjects = (req, res, next) => {
    req.filterProgress = (progress)=>progress!='100%';
    req.title = "Inompleted projects";
    next();
}

exports.getProject = catchAsync(async (req, res)=>{

    let project;
    let role = 'admin';

    if(req.user.role == 'user'){
        role = 'user';
        let projects = await Project.aggregate([
            {"$match": {_id: mongoose.Types.ObjectId(req.params.projectId)}},
            {'$lookup': {"localField":'members', "foreignField": "_id", "from":"User", "as": "members"}}
        ]);
        projects[0].tasks = await Task.find({"user": mongoose.Types.ObjectId(req.user._id), project: projects[0]}).sort({"dueDate": 1});
        project = projects[0];
    }else{
        project = await Project.findById(req.params.projectId).populate('tasks', 'status dueDate').populate('members');
    }
    project.progress = await getProjectProgress(project._id)+"%";
    return res.render("project/project-details", {title: project.title, project, role, "user": req.user});
});

exports.insertProject = async (req, res) => {;

    req.body.dueDate = Date.parse(req.body.dueDate);

    // insert project
    Project.create(req.body).then(data=> {
        res.redirect("/projects");
    }).catch(err=>{
        console.log(err.message);
        res.render("project/projectForm", {errorMessage: err.message, title: 'Add project', "user": req.user});
    });
}

exports.deleteProject = catchAsync(async (req, res)=> {
    
    await Task.deleteMany({"project": req.params.projectId});
    await Project.deleteOne({_id: req.params.projectId});
        
    res.redirect("/projects");
});

exports.updateProject = catchAsync(async (req, res)=> {
    
    const updateProject = await Project.replaceOne({_id: req.params.projectId}, req.body);
      
    console.log(updateProject);
    
    res.redirect(`/project/${req.params.projectId}`);
});

exports.projectInsertForm = catchAsync( async (req, res)=>{

    const users = await userController.getUserList();

    res.render("project/projectForm.ejs", {title: "Add project", errorMessage:undefined, users, "user": req.user});
});

exports.projectUpdateForm = catchAsync( async (req, res)=>{

    const users = await userController.getUserList();

    const project = await Project.findById(req.params.projectId).populate('tasks').populate('members');

    res.render("project/projectUpdateForm.ejs", {title: "Update project", errorMessage:undefined, users, project, "user": req.user});
});

async function getProjectProgress(projectId){

    let project = await Project.findById(projectId).populate('tasks', "status")

    if(project.tasks.length == 0) return 0

    let completedTasks = 0;

    project.tasks.forEach(task => {
        if(task.status == 'completed')
            completedTasks = completedTasks + 1;
    });
    console.log(completedTasks / project.tasks.length * 100);
    return parseInt(completedTasks / project.tasks.length * 100);
}