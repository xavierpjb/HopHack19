const express = require('express')
const app = express()
const PORT = 3000;
const HOST = '0.0.0.0';

const multer = require('multer'); //for file uploading to db
const mongoose = require('mongoose');// for database connection
const bodyParser= require('body-parser')//for parsing data
const fs = require('fs');//for filesystem

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://mongo:27017/testdb', { useNewUrlParser : true}).then(() => {
console.log("Connected as container to Database")
}).catch((err) => {
  console.log("Could not connect as container", err);
  //try connecting through localhost
  console.log("Trying to connect to localhost")
  mongoose.connect('mongodb://localhost:27017/testdb', { useNewUrlParser : true}).then(() => {
  console.log("Connected to Database as localhost");
  }).catch((err) =>
  {
    //try connecting through localhost
    console.log("Not Connected to Database ERROR! ", err);
  });
});







app.get('/', (req, res) => res.send('Hello World!'))

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
