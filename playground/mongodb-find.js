const {MongoClient, ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    //access collection
    //by default, call find with no arguments - meaning we're not providing
    //a query => fetch all Todos, want every documents from todos collection
    //find returns a mongodb cursor, not the actual documents, 
    //a pointer to those documents
    //cursor has methods to get our documents
    //toArray: an array of documents - objs, return a promise
    //------
    // db.collection('Todos').find().toArray().then((docs)=>{
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err)=>{
    //     console.log('Unable to fetch todos', err);
    // })
    ///------
    //query based on certain values
    //quey just items that aren't completed
    //pass a query into find
    //------
    // db.collection('Todos').find({completed: false}).toArray().then((docs)=>{
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err)=>{
    //     console.log('Unable to fetch todos', err);
    // })
    //----
    // db.collection('Todos').find({
    //     _id: new ObjectID('5c212d6b75a1ed4b410fe356')
    // }).toArray().then((docs)=>{
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err)=>{
    //     console.log('Unable to fetch todos', err);
    // });
    //----
    db.collection('Users').find({name: 'Ly Cao'}).toArray().then((docs)=>{
        console.log(`Todos`);
        console.log(JSON.stringify(docs,undefined,2));
    }, (err)=>{
        console.log('Unable to fetch todos', err);
    });

    //count all todos in Todos collection
    //db.close();
});

