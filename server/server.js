require('./config/config');

const _ = require('lodash');
//lib import
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

//local import
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app = express();
//it will be set if it runs on heroku, else  wont
// const port = process.env.PORT || 3000;
//NODE_ENV
const port = process.env.PORT;

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
    });

    todo.save().then((doc)=>{
        //now send the respond back
        res.send(doc);
        //http status, default by express is 200
    }, (e)=>{
        res.status(400).send(e);
    });
})

//read todo- get/return all todos
//GET/todos
//individual todo + id when have authentication
//GET/todos//98rqwr98ew89q

app.get('/todos',(req,res)=>{
    Todo.find().then((todos)=>{
        //send back obj rather than array so in the future we can add
        //more properties like code etc
        res.send({todos});
    },(e)=>{
        res.status(400).send(e);
    });
});

//url parameter: colon + name
//GET /todo/${id}
//create an id variable, on req obj, we can access that variable
app.get('/todos/:id', (req,res)=>{
    //req.param is an obj: key-value pairs, key: url parameter
    //value: whatever value was put in :
    //res.send(req.params)
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findById(id).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e)=>res.status(400).send());
});

app.delete('/todos/:id', (req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo)=>{
        if(!todo){
            //todo is not found, no doc
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch((e)=> res.status(400).send());
});

//UPDATE - use patch to update resource

app.patch('/todos/:id', (req,res)=>{
    var id = req.params.id;
    //where update is stored- where needs lodash
    //they can send any property, maybe not even on todo item
    //or properties we dont want them to update like completeAt
    //this is updated by us when user update complete property
    //pull out just the property we want user to update: pick
    //arguments: obj, array of properties that you wanna pull off
    //if they exist
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)){
        res.status(404).send();
    }
    
    if(_.isBoolean(body.completed) && body.completed){
        //miliseconds since midnight  jan 1st 1970
        //>0 forward, <0: past
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
        //remove a value from database = setting to null
    }

    //$set sets a set of key-value pairs, which is body in this case
    //new =  return originals in findOneAndUpdate of mongodb in playground
    //update: return the updated one, not the original
    Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo)=>{
        if(!todo){
            return res.status(404).send();
        }
        res.status(200).send({todo});
    }).catch((e)=> res.status(400).send());
});

// POST /users
//sign up
app.post('/users', (req,res)=>{
    var body = _.pick(req.body, ['email', 'password']);

    //if no email provided, none in body and validation will also fail
    var user = new User(body);

    //we can use user as argument to then, but that value is identical
    //to the user variable above, same thing in memory
    //=> can clear up the argument, just clears up what's happening
    //doesnt change functionality
    user.save().then(()=>{
        //res.status(200).send({user});
        return user.generateAuthToken();
    }).then((token)=>{
        //sends back the only user defined above
        //send token back as http respond header
        //header: 2 arguments, key-value pairs, key: header's name
        //value is the value you wanna set the header to
        //when you prefix a header with x-: custom header,
        //not what http supports by default, a header that you're using
        //for specific purposes 
        //custom header to store jwt token scheme
        
        res.header('x-auth',token).send(user);
    })
    .catch((e)=> res.status(400).send(e));

});

//callback will get fired once the app is up
app.listen(port,()=>{
    console.log(`Started on port ${port}`);
})

module.exports = {app};

//postman makes it easier to fire off http request- get/post method

//made changes in user model
//1.shut down server
//2. wipe todoapp database
//3. restart server