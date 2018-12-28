//mocha and nodemon don't need to be required
const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

//querying into the database -> access to model

//..: going back 1 directory from test to server
const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');
const {User} = require('./../models/user');

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

//populate users before todos
beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('DELETE /todos/:id',()=>{
    //quey the database, making sure todo was deleted
    it('should remove a todo',(done)=>{
        var id = todos[1]._id.toHexString();

        request(app)
        .delete(`/todos/${id}`)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo._id).toBe(id)
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }

            Todo.findById(id).then((todo)=>{
                expect(todo).toNotExist();
                //important****
                done();
            }).catch((e)=>done(e));
        });
    });

    it('should return 404 if todo not found', (done)=>{
        var id = new ObjectID().toHexString();
        request(app)
        .delete(`/todos/${id}`)
        .expect(404)
        .end(done);
    });
    it('should return 404 if the ObjectID is invalid',(done)=>{
        var id = '123'
        request(app)
        .delete(`/todos/${id}`)
        .expect(404)
        .end(done);
    });
});

describe('PATCH /todos/:id',()=>{
    it('should update the todo', (done)=>{
        var id = todos[0]._id.toHexString();
        var text = "have to complete section 8"
        request(app)
        .patch(`/todos/${id}`)
        .send({text, completed: true})
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.completedAt).toBeA('number');
        }).end(done);
        // }).end((err,res)=>{
        //     if(err){
        //         return done(err);
        //     }
        //     done();
        // });
    });
    it('should clear completedAt when todo is not completed', (done)=>{
        var id = todos[1]._id.toHexString();
        var text = 'Updated test text';
        request(app)
        .patch(`/todos/${id}`)
        .send({text, completed:false})
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist();
        }).end(done);
        // }).end((err,res)=>{
        //     if(err){
        //         return done(err);
        //     }
        //     done();
        // });
    });
});

describe('GET /users/me',()=>{
    it('should return the user if authenticated', (done)=>{
        //set header in super test( headername, header value)
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        }).end(done);
    });

    //when no token provided, no random user is sent back
    it('should return 401 if not authenticated', (done)=>{
        //compare objects = toEqual, 401 b/c no token given
        request(app)
        .get('/users/me')
        .expect(401)
        .expect((res)=>{
            expect(res.body).toEqual({});
        }).end(done);
    });
});

describe('POST /users', ()=>{
    it('should create a user', (done)=>{
        var email = 'example@example.com';
        var password = '123mnb';

        //send some data along with post  request
        request(app)
        .post('/users')
        .send({email, password})
        .expect(200)
        .expect((res)=>{
            //res.headers obj has the header called x-auth
            //access the property, cannot do . notation b/c - will cause error
            expect(res.headers['x-auth']).toExist();//exist b.c we dont know
            expect(res.body._id).toExist();//unknown to us now
            expect(res.body.email).toBe(email);//we have email though
        })
        .end((err)=>{
            if(err){
                return done(err);
            }

            //should find it since we got 200 status above
            User.findOne({email}).then((user)=>{
                expect(user).toExist();
                //b/c pw is hashed
                expect(user.password).toNotBe(password);
                done();
            }).catch((e)=> done(e));
        });
    });

    it('should return validation error if request invalid', (done)=>{
        //send invalid email and pw, expect 400
        request(app)
        .post('/users')
        .send({email:'lyhehe', password: 'i'})
        .expect(400)
        .end(done);
    });

    it('should not create user if email in use', (done)=>{
        //one email in seed users, valid pw, 400  
        request(app)
        .post('/users')
        .send({email: users[0].email, password: '1234567'})
        .expect(400)
        .end(done);
    });
});

describe('POST /users/login', ()=>{
    it('should login user and return auth token', (done)=>{
        //valid email and pw
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password
        })
        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toExist();
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }

            //catch any async func
            //query
            User.findById(users[1]._id).then((user)=>{
                //token created
                expect(user.tokens[0]).toInclude({
                    access: 'auth',
                    token: res.headers['x-auth']
                });
                done();
            }).catch((e)=> done(e));
        });
    });

    it('should reject invalid login', (done)=>{
        //x-auth notExist, tokens lentgh = 0 user1 does
        //not have  one at the start, 400 status
        request(app)
        .post('/users/login')
        .expect(400)
        .expect((res)=>{
            expect(res.headers['x-auth']).toNotExist();
            //expect(users[1].tokens).toNotExist();
            //access from seed
        })
        .end((err,res)=>{
            if(err){
                return done(err);
            }

            //catch any async func
            //query
            //access from model
            User.findById(users[1]._id).then((user)=>{
                //token not created
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((e)=> done(e));
        });
    });
});




