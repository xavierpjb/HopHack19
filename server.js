const express = require('express')
const app = express()
const PORT = 3000;
const HOST = '0.0.0.0';

const multer = require('multer'); //for file uploading to db
const mongoose = require('mongoose');// for database connection
const bodyParser= require('body-parser')//for parsing data
const fs = require('fs');//for filesystem

app.use(bodyParser.urlencoded({extended: true}));








app.get('/', (req, res) => res.send('Hello World!'))

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))


/*

'use strict';

const express = require('express');
// Assigning localhost and port number
const PORT = 3000;
const HOST = '0.0.0.0';

const multer = require('multer'); //for file uploading to db
const mongoose = require('mongoose');// for database connection
const bodyParser= require('body-parser')//for parsing data
const fs = require('fs');//for filesystem
const app = express();//for initialising server

app.use(bodyParser.urlencoded({extended: true}));

//Connecting to mongodb
//Try connecting as a container
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


//Database Schema for Images
var ImageSchema = new mongoose.Schema({
  img: {data: Buffer, contentType: String },
  caption: String
});
var Image = mongoose.model('Image', ImageSchema);

var MuralSchema = new mongoose.Schema({
  username: String,
  image: {type: mongoose.Schema.Types.ObjectId, ref: 'Image'}},
  {
  timestamps: {createdAt: 'created_at'}
});

// SET STORAGE
const storage = multer.diskStorage({ // notice you are calling the multer.diskStorage() method here, not multer()
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
const upload = multer({storage});

var type = upload.single('myImage');

//Upload photo through browser
app.post('/uploadphoto', type, function(req, res) {
  var path = req.file.path;
  var newImage = new Image();
  var img = fs.readFileSync(path);
  console.log('got here read')

  var encode_image = img.toString('base64');
  newImage.img.data = Buffer.from(encode_image, 'base64');
  newImage.img.contentType = req.file.mimetype;
  newImage.save(function (err){
    if (err) return console.log(err);
    console.log('saved to database')
    res.redirect('/')
  });
})

//Get photo by id
app.get('/photo/:id', (req, res) => {
  var filename = req.params.id;
  console.log("got to func")
  Image.findById(filename, function(err, newImg){
    if (err) return console.log(err);
    res.contentType('image/jpeg');
    res.send(newImg.img.data);
  });
});

//delete by photo id
app.post('/delete', function(req,res) {

  //take id num
  var nameValue = req.body.photoID;
  console.log(nameValue);

  //Delete from db using id
  Image.deleteOne({_id:nameValue}, function (err) {
    if (err) return handleError(err);
    console.log('saved to database')
    res.redirect('/')
  });
});



app.get('/', (req, res) => {
   res.sendFile(__dirname + "/web/index.html");
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

*/
