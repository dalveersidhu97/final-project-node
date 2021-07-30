var mongoose = require('mongoose');

var projectSchema = new mongoose.Schema({
    title:{
        type:String,
        required: [true, 'Project must have a title']
    },
    description:{
        type:String,
        required: [true, 'Project must have a name']
    },
    startDate: {
        type: Date,
        required: [true, 'start date cant is must'],
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: [true, 'Please select due date for the project'],
        default: Date.now
    },
    members:  [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

// tell Mongoose to retreive the virtual fields
projectSchema.set('toObject', { virtuals: true });
projectSchema.set('toJSON', { virtuals: true });

projectSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'project',
    justOne: false,
    options : {select: 'title description user'}
});

// collecetion den schema
module.exports = mongoose.model('Project',projectSchema, 'Project');