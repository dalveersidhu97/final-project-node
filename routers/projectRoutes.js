const express = require('express');

// CONTROLLERS
const projectController = require('../controller/projectController');
const taskController = require('../controller/taskController');
const userController = require('../controller/userController');

const taskRouter = require('./taskRoutes');
const projectRouter = express.Router();

// MIDDLEWARE LOGIN
projectRouter.use(userController.isLoggedIn);

// PROJECT ROUTES
projectRouter
     // for /projects
    .get('/',projectController.getAllProjects)
    .get('/completed-projects', projectController.filterCompleteProjects, projectController.getAllProjects)
    .get('/incomplete-projects', projectController.filterInompleteProjects, projectController.getAllProjects)
     // for /project
    .get('/insert', userController.adminOnly, projectController.projectInsertForm)
    .get('/:projectId', projectController.getProject)
    .get('/:projectId/update', userController.adminOnly, projectController.projectUpdateForm)
    .post('/:projectId/update', userController.adminOnly, projectController.updateProject)
    .post('/insert', userController.adminOnly, projectController.insertProject)
    .delete('/:projectId', userController.adminOnly, projectController.deleteProject)
    .get('/:projectId/delete', userController.adminOnly, projectController.deleteProject);

projectRouter.use('/:projectId/task', taskRouter);

module.exports = projectRouter;