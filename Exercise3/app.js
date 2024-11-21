const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routes = require('./routes/index');
//var cors = require('cors')

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cookieParser());
//app.use(cors);

app.use('/', routes);

module.exports = app;


/*app.get('/', function(req,res){
    res.json({
        'status' : `Working!`,
    });
});

app.listen(8080, function() {
    console.log('Product service is listening!');
})*/