var express = require('express');
var path = require('path');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var port = 80;

var clients = [];

app.use(express.static(path.join(__dirname, 'static')));


io.on('connection', function(socket){
  var currentUser;
  
  
  socket.on('USER_CONNECT', function(msg){
    
    //console.log("User Connected");
    for (var i = 0; i < clients.length; i++)
    {
      socket.emit("USER_CONNECTED", {name: clients[i].name, type:clients[i].type});
      console.log("User Connected: " + clients[i].name);
    }
    
    
    
  });
  socket.on ('GETDATA', function(data)
{
  currentUser = {
    type: data.type,
    name: data.name
  }
  clients.push(currentUser);
  
  socket.emit("GETDATA", currentUser);
  socket.emit("USER_CONNECTED", currentUser); 
  socket.broadcast.emit("USER_CONNECTED", currentUser);
  console.log("User data recieved: " + currentUser.name);
});
  
  socket.on('disconnect', function(){
    socket.broadcast.emit("USER_DISCONNECTED", currentUser);
    for(var i = 0; i < clients.length; i++)
    {
      //console.log(clients[i].name === currentUser.name);
       if (clients[i].name === currentUser.name)
       {
        console.log("User " + clients[i].name + " disoconnected");
        clients.splice(i,1);
       }
    }
  });
  socket.on("removeClient", function(data)
{
  ///console.log(data.name);
  for(var i = 0; i < clients.length; i++)
  {
    console.log(data.name === clients[i].name);
    if (clients[i].name === data.name)
    {
      clients.splice(i, 1);
    }
  }
});
  socket.on('forUnity', function(data)
  {
    console.log("Got data for unity: " + data.data);
    socket.broadcast.emit("forUnity", data.data);
  });
  socket.on("forClinician", function(data)
    {
      console.log("Got data for unity");
     socket.broadcast.emit('forClinician', data);
    });
});


// Listen for requests
var server = http.listen(port, function() {
  console.log('Loaded on port: ' + port);
});
