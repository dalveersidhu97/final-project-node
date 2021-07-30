var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, 'Please enter name']
    },
    email:{
        type:String,
        required: [true, 'Please enter email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password']
    }, 
    role: {
        type: String, 
        default: 'user'
    }
});
// tell Mongoose to retreive the virtual fields);
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });
// collecetion den schema
module.exports = mongoose.model('User',userSchema, 'User');