const express = require('express');
const http = require("http");
var mysql = require('mysql');
var app = express();

var dbInfo  = {
  host: "localhost",
  user: "root",
  password: "root",
  database: "UsersDb",
};

app.get('/api/allUsers', getAllUsers);


const server = http.createServer(app);
let port = 3000;

server.listen(port, function() {
    console.log("Server listening....", port);
});

//Create the users table using below query.
//Else use import file using dbname < file.sql
/*create table users(
    userId INT NOT NULL AUTO_INCREMENT,
    userName VARCHAR(100) NOT NULL,
    userEmail VARCHAR(40) NOT NULL,
    userDOB DATE,
    userAdress VARCHAR(100) NOT NULL,
    PRIMARY KEY ( userId )
 );*/

function getAllUsers(req, res){
  const limit = 20
  const page = req.query.page
  const offset = (page - 1) * limit
  const query = `select * from users limit ${limit} OFFSET ${offset}`
  dbInfo.getConnection(function(err, connection) {
    connection.query(query, function (error, results, fields) {
      connection.release();
           if (error) throw error;
        var jsonResult = {
        'users_page_count':results.length,
        'page_number':page,
        'users':results
      }
      var myJsonString = JSON.parse(JSON.stringify(jsonResult));
      res.statusMessage = "Users for page "+page;
      res.statusCode = 200;
      res.json(myJsonString);
      res.end();
    })
  })
}