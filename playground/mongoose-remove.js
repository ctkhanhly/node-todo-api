const  {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//Todo.remove(): 
//similar to find() => remove multiple based on the property you passed in
//but if wanna remove everything, has to pass in an empty obj
//remove({})

// Todo.remove({}).then((result)=>{
//     console.log(result);
// });

//get back the doc, remove the 1st one found
Todo.findOneAndRemove({_id:'5c24364e45ca534986dd5fe0'}).then((todo)=>{
    console.log(todo);
});

//then get the todo obj back
//this one still has success call even if no todo was deleted
Todo.findByIdAndRemove('5c24364e45ca534986dd5fe0').then((todo)=>{
    console.log(todo);
});
