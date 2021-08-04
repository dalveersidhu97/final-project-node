const express = require('express');

// CONTROLLERS
const projectController = require('../controller/projectController');
const taskController = require('../controller/taskController');
const userController = require('../controller/userController');

const taskRouter = express.Router({mergeParams: true});

// MIDDLEWARE LOGIN
taskRouter.use(userController.isLoggedIn); 

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
    
module.exports = taskRouter;