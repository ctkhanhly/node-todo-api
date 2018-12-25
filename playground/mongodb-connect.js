//Related to mongodb but not Todo
//load lib and connect to database

//mongo client lets you connect to a server and issue commands
// to manipulate the databases

//const MongoClient = require('mongodb').MongoClient;

//-----
//pull of any property from the mongodb library
const {MongoClient, ObjectID} = require('mongodb');

// var obj = new ObjectID();// ObjectID is a constructor function
// console.log(obj.toHexString());
//-----


//obj destructuring lets you pull out properties from the obj creating 
//variables

// var user = {name: 'andrew', age: 25};
// //grab name and creat name variable.
// //create a new name variable and set equal to name of user
// var {name} = user;
// console.log(name);

//connect to the database
//arguments: str of url where ur database lives ~ AWS or heroku url or
//local host url, 2nd: callback function=> gets fired after connection has
//succeeded or failed
//connect to mongodb -> use mongodb protocol like 1st argument
//local host= running on a local machine: port
// /which database we wanna connect to
// e.g: test folder under studio 3T, what mongodb gives you


//havent created TodoApp. In mongodb, unlike other databases,
//we don't need to create a database before we can use it/connect to it

//mongo is not gonna create a database until we add some data in it
//v3: pass in client instead of db
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
    //have different collections in TodoApp database
    //potential err
    if(err){
        //return to just stop the program from running other code
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    //v3: argument: reference to the database
    //const db = client.db('TodoApp');
    //------

    //only argument: str name you wanna insert as a collection
    //insertOne: insert a new Documentation in ur collection
    //obj: store various key-value pairs, 2nd: callback func gets fired
    //when things either fail or go well
    //_id property automatically get added by mongo

    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result)=>{
    //     if(err){
    //         return console.log('Unable to insert todo', err);
    //     }

    //     console.log(JSON.stringify(result.ops,  undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //     //override mongo's  id generation
    //     // _id: 123,
    //     name: 'Ly Cao',
    //     age: 19,
    //     location: 'Brooklyn'
    // }, (err, result)=>{
    //     if(err){
    //         return console.log('Unable to insert user', err);
    //     }

    //     //console.log(JSON.stringify(result.ops,  undefined, 2));
    //     //show all records we inserted, here only insert 1
    //     //console.log(result.ops);
    //     console.log(result.ops[0]._id.getTimestamp());
    // });


    //function to make our own obj id


    //v3:
    //client.close
    //close the connection with mongodb server
    //---
    db.close();
});

//insert documents using mongo native lib