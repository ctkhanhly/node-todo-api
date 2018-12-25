const {MongoClient, ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');
    //return Promise if no callback is passed in
    //findOneAndUpdate(filter, update,options,callback=optional)
    //mongodb update operators
    //also get back obj, like findOneAndDelete
    //-----
    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID('5c21b94745ca534986dd5f58')
    // },{
    //     $set:{
    //         completed: true
    //     }
    // },{
    //     //return the updated one instead of the original
    //     returnOriginal: false
    // }).then((result)=>{
    //     console.log(result);
    // });
    //------
    db.collection('Users').findOneAndUpdate({
        name: 'Huy'
    },{
        $set:{
            name: 'Ly'
        },
        $inc:{
            age: 1
        }
    },{
        //return the updated one instead of the original
        returnOriginal: false
    }).then((result)=>{
        console.log(result);
    });
    //db.close();
});

