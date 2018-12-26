const  {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');
//const {MongoClient, ObjectID} = require('mongodb');


// var id = '5c22d598d6a713865766f0ea';
// //change a number=> valid id, but not in the database

//VALIDATION
// if(!ObjectID.isValid(id)){
//     console.log('ID is not valid');
// }
//----

//find passed in as many query as you like
//---- FIND - TODO
// Todo.find({
//     //mongoose doesnt require to pass in ObjectID, it does that for you
//     //convert to ObjectID for you and then run the query
//     _id: id,
// }).then((todos)=>{
//     // console.log('Todos');
//     // todos.forEach((todo)=> console.log(todo._doc));
//     console.log('Todos',todos);
//----
    
// });

// //return 1 doc at most, 1st one that matches
// //if only need 1 doc - use findOne instead of find b/c get 1 doc
// //instead of an array
// //if DNE: instead of empty array, get null back - deal with that
//---- FINDONE -TODO
// Todo.findOne({
//     _id: id
// }).then((todo)=>{
//     console.log('Todo',todo);
// });//.catch((e)=> console.log(e););
//---


//don't have to make a query obj or set _id property
//----FINDBYID - TODO
// Todo.findById(id).then((todo)=>{
//     //if todo = null, DNE in todos
//     if(!todo){
//         return console.log('Id not found');
//     }
//     console.log('Todo by Id',todo);
// }).catch((e) => console.log(e));
//----
//add catch to validate id: longer than normal length or sth like that

//if id isn't correct 

//case1: query works but no user
//case2: found  user
//case3: any error

var id = '5c226b5ea9ea7cba51a2df02';
User.findById(id).then((user)=>{
    if(!user){
        return console.log('User not found')
    }
    console.log('User', user._doc);
},(e)=>console.log(e));

