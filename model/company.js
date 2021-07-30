var mongoose = require('mongoose');

var companySchema = new mongoose.Schema({
    name:{
        type:String,
        required: [true, 'company must have a name']
    }
});

module.exports = mongoose.model('Company', companySchema, 'Company');