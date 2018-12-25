//lib import
var express = require('express');
var bodyParser = require('body-parser');

//local import
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

//in rest api: crud operation: create, update, delete. configure route
//post route,  where we create new todo- send a json obj to server
//has text property and server get that text property, create a new model
//and send the complete model with id, complete property and app back
//post http method, sends as the body

//url, callback ---> express : /todos: resource  creation, create a new todo

//return value in this parameter is a function
//send json to express app
app.use(bodyParser.json());
app.post('/todos', (req,res)=>{
//get the body data that got sent from the client inside post->body in postman
    //url: localhost:3000/todos
    //no respond b/c havent set up yet
    //console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    })

    todo.save().then((doc)=>{
        //now send the respond back
        res.send(doc);
        //http status, default by express is 200
    }, (e)=>{
        res.status(400).send(e);
    })
})

//read todo- get all todos
//GET/todos
//individual todo + id
//GET/todos//98rqwr98ew89q


//callback will get fired once the app is up
app.listen(3000,()=>{
    console.log('Started on port 3000');
})