const {MongoClient, ObjectID} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db)=>{
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

   //deleteMany
//    db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result)=>{
//        console.log(result);
//    })

    //deleteOne: only delete the 1st item that matches criteria
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((res)=>{
    //     console.log(res);
    // })

    //findOneAndDelete: return the deleted one, 1st one found
    // db.collection('Todos').findOneAndDelete({completed:false}).then((res)=>{
    //     console.log(res);
    // })

    // db.collection('Users').deleteMany({name: 'Ly Cao'}).then((result)=>{
    //     console.log(result);
    // })

    db.collection('Users').findOneAndDelete({_id: new ObjectID('5c2130be67a11b4b47954cad')})
    .then((result)=>{
        console.log(result);
    });
    //result obj with ok property
    //count all todos in Todos collection
    //db.close();
});

