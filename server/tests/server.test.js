//mocha and nodemon don't need to be required
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

//querying into the database -> access to model

//..: going back 1 directory from test to server
const {app} = require('./../server');
const {Todo} = require('./../models/todo');


const todos = [{
    //specify id here so we can access at get id test below
    _id: new ObjectID(),
    text: 'First test todo'
},{
    _id: new ObjectID(),
    text: 'Second test todo'
}];

//beforeEach lets us run some code before every single test case
//make sure the database is empty
//this function gets called before every test case and only move on
//to the test case once we call done => can do sth asynchronous

//----
// beforeEach((done)=>{
//     //similar to mongodb native method
//     Todo.remove({}).then(()=>  done());
//     //now our database will be empty before every request
// })
//----
//insertMany takes an array
beforeEach((done)=>{
    Todo.remove({}).then(()=>{
        //return respond
        return Todo.insertMany(todos);
    }).then(()=>done());
});

describe('POST /todo',()=>{
    it('should create a new todo',(done)=>{
        var text = 'Test todo text';
        //send data: an obj, will be converted to json by supertest
        request(app)
        .post('/todos')
        .send({text})
        .expect(200)
        .expect((res)=>{
            expect(res.body.text).toBe(text);
        })
        .end((err,res)=>{
            if(err){
                //wrap  up the test,  printing error to the screen
                return done(err);
            }
            //make a request to database, fetch all todos, verify that 1 
            //todo was added

            //similar to mongodb native find method - fetch everything in that 
            //collection
            //---
            // Todo.find().then((todos)=>{
            //     //either of these fail,test still pass unless add catch
            //     //assume that nothing already in the database- true thanks
            //     //to beforeEach
            //     expect(todos.length).toBe(1);
            //     expect(todos[0].text).toBe(text);
            //     done();
            // }).catch((e)=> done(e));
            //---

            Todo.find({text}).then((todos)=>{
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e)=> done(e));
            //---
        });
    }),

    //beforeEach runs before this test case too
    //test todo does not get created when we send bad data
    it('should not create todo with invalid body data',(done)=>{
        request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err,res)=>{
            if(err){
                return done(err);
            }

            //length = 2 at beforeEach
            Todo.find().then((todos)=>{
                expect(todos.length).toBe(2);
                done();
            }).catch((e) => done(e)); //find and toBe
            //(e)=>done(e); only catches todos err?
        });
    })
    
});

describe('GET /todos',()=>{
    it('should get all todos', (done)=>{
        request(app)
        .get('/todos')
        .expect(200)
        .expect((res)=>{
            expect(res.body.todos.length).toBe(2);
        }).end(done);
        //no need to pass a function to end b/c dont do asynchronous
    });
});

describe('GET /todos/:id',()=>{
    it('should return todo doc', (done)=>{
        request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(todos[0].text);
        }).end(done);
    });

    it('should return 404 if todo not found',(done)=>{
        request(app)
        .get('/todos/new ObjectID().toHexString()')
        .expect(404)
        .end(done);
    });

    it('should return 404 if invalid id - id is non-ObjectID',(done)=>{
        request(app)
        .get('/todos/123')
        .expect(404)
        .end(done);
    });
});

