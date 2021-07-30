var mongoose = require('mongoose');

var taskSchema = new mongoose.Schema({
    title:{
        type:String,
        required: [true, 'company must have a name']
    },
    description:{
        type:String,
        required: [true, 'company must have a name']
    },
    startDate: {
        type: Date,
        required: [true, 'company must have a name'],
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: [true, 'company must have a name'],
        default: Date.now
    },
    user : {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    project: {type: mongoose.Schema.Types.ObjectId, ref: 'Project'},
    status:  {
        type: String,
        default: "incomplete"
    }
});
// tell Mongoose to retreive the virtual fields);
taskSchema.set('toJSON', { virtuals: true });
taskSchema.set('toObject', { virtuals: true });

taskSchema.pre('find', function(next) {
    this.populate('user');
    next();
});

// collecetion den schema
module.exports = mongoose.model('Task',taskSchema, 'Task');