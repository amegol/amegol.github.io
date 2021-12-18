var express = require('express');
var app = express();
var localtunnel = require('localtunnel');
app.listen(3000, function(){
    console.log('listening on port 3000');
    var tunnel = localtunnel({
             port: 3000,
           subdomain: 'amegol'
        });
    console.log(tunnel.url);
});
var users = [];
app.get('/newUser', function(req, res){
    var prename = req.query.prename;
    var lastname = req.query.lastname;
    //check if prename is empty
    if(prename == '' || lastname == '' || prename == undefined || lastname == undefined || prename == null || lastname == null){
        res.json('Please enter a name');
    }
    else{
        if(users.length == 0){
            res.json('no user');
        }
        else{
            var randomUser = Math.floor(Math.random() * users.length);
            while(prename == users[randomUser] || lastname == users[randomUser]){
                randomUser = Math.floor(Math.random() * users.length);
            }
            //send the new user and the random user
            res.json(users[randomUser]);
        }
    }
});
app.get('/addUser', function(req, res){
    var prename = req.query.prename;
    //check if prename is empty
    if(prename == ''){
        res.json('Please enter a name');
    }
    else{
        //check if user already exists
        if(users.indexOf(prename) == -1){
            users.push(prename);
            res.json('User added');
        }
        else{
            res.json('User already exists');
        }
    }
});
app.get('/getUsers', function(req, res){
    //send in json format
    res.json(users);
});