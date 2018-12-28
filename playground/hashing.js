//256 bits of the resulting hash
//1-way function, only 1 output for an input
const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 10
};

//take the obj, data with user id: sign = hash it, return token value
//arguments: obj and secret, return a token to user when 
//they either sign up or log in - token = a hash = signature

var token = jwt.sign(data, '123abc');
console.log(token);

//take the token and the secret and make sure the data was not manipulated
//if token = token + '1' or secret = '123abc' + 'c' => verification error
var decoded = jwt.verify(token, '123abc');
console.log('decoded: ', decoded);



/*
var  message = 'I am user number 3';
var hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);
//JWT: JASON WEB TOKEN

//id that matches the token
var data = {
    //this is the data we send back to the client
    id: 4
};

var token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
}
//sult hash: add sth to the hash that is unique that changes the value
//password + some randomly generated value: salt
//different salting everytime => not getting the same hash twice

//now the client can change data, rehash, but they don't have the 
//secret salt => bad hash

//check that the token was not manipulated


//men in the middle simulation:
token.data.id = 5;
token.hash = SHA256(JSON.stringify(data)).toString();

var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

if(resultHash === token.hash){
    //data wasnt manipulated
    console.log('Data was not changed');
}else{
    console.log('Data was changed');
}

*/

//jsonwebtoken: 2 functions  1 to create token, the other is to verify it
