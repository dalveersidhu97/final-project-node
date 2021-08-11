
const mongoose = require('mongoose');
const app = require('./app');

// CONNECTING TO DATABASE
mongoose.connect('mongodb+srv://dalveersidhu97:3q5vThotLgTVhePS@cluster0.v2aom.mongodb.net/ProjectsDB?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true});
    const db =mongoose.connection;
    db.on('error',console.error.bind(console,'Connection error'));
    db.once('open',function(){
    console.log("we are connected on mongoose");
});

// PORT
const PORT = process.env.PORT || 80;

// SERVER
app.listen(PORT);