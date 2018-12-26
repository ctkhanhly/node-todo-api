//mocha and nodemon don't need to be required
const expect = require('expect');
const request = require('supertest');

//querying into the database -> access to model

//..: going back 1 directory from test to server
const {app} = require('./../server');
const {Todo} = require('./../models/todo');


//beforeEach lets us run some code before every single test case
//make sure the database is empty
//this function gets called before every test case and only move on
//to the test case once we call done => can do sth asynchronous
beforeEach((done)=>{
    //similar to mongodb native method
    Todo.remove({}).then(()=>  done());
    //now our database will be empty before every request
})

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
            Todo.find().then((todos)=>{
                //either of these fail,test still pass unless add catch
                //assume that nothing already in the database- true thanks
                //to beforeEach
                expect(todos.length).toBe(1);
                expect(todos[0].text).toBe(text);
                done();
            }).catch((e)=> done(e));
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

            Todo.find().then((todos)=>{
                expect(todos.length).toBe(0);
                done();
            }, (e) => done(e));
        });
    })
    
});