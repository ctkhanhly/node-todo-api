//seed data to database
//need x-auth token inside supertest to test authenticate
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

//to reference this id in token
const userOneId = new ObjectID();
const userTwoId = new ObjectID();
//1st: valid authentication, 2nd: no authentication, no x-auth
const users = [{
    _id: userOneId,
    email: 'lycao@example.com',
    password: 'userOnepw',
    tokens:[{
        access: 'auth',
        token: jwt.sign({ _id: userOneId, access: 'auth'}, 'abc123').toString()
    }]
},{
    _id: userTwoId,
    email: 'ly@example.com',
    password: 'userTwopw',
    tokens:[{
        access: 'auth',
        token: jwt.sign({ _id: userTwoId, access: 'auth'}, 'abc123').toString()
    }]
}];

const todos = [{
    //specify id here so we can access at get id test below
    _id: new ObjectID(),
    text: 'First test todo',
    _creator: userOneId
},{
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 123,
    _creator: userTwoId
}];

//feed beforeEach in server.test.js

const populateTodos = (done)=>{
    Todo.remove({}).then(()=>{
        //return respond
        return Todo.insertMany(todos);
    }).then(()=>done());
};

//insertMany is not gonna run middleware
const populateUsers = (done)=>{
    User.remove({}).then(()=>{
        //pass in User obj user1
        //save return user1
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        //wait for both of them to succeed
        //promise.all takes an array of promises
        //the then after this Promise won't get called until all promises resolved
        //or user1 and user2 were successfully saved to the database
        //call save = running middleware
        return Promise.all([userOne,userTwo]);
    }).then(()=> done());
}

module.exports = {todos,populateTodos,users, populateUsers};