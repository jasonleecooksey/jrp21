var express = require('express');
var router = express.Router();

// mongoose connection
var mongoose = require('mongoose');
mongoose.connect('localhost:27017/test');

// schema (blueprint)
var Schema = mongoose.Schema;

var userDataSchema = new Schema({
  title: String,
  content: String,
  author: String
});

// model (access to the collection)
var UserData = mongoose.model('UserData', userDataSchema);

// insert (CRUD)
router.post('/insert', function(req,res,next){

  // var item = {
  //   title : "To Kill A Mockingbird",
  //   content : "This book was banned because it had bad words",
  //   author : "Harper Lee"
  // };

  var item = {
    title : req.body.title,
    content : req.body.content,
    author : req.body.author
  };

  var data = new UserData(item);

  data.save();
  res.redirect('/');

});

router.get('/get-data', function(req,res,next){
  UserData.find()
    .then(function(doc){
      res.render('index', {items: doc});
    });
});

// get (CRUD)
router.get('/data', function(req,res,next){
  UserData.find()
    .then(function(doc){
      res.render('data', {items: doc});
    });
});

// delete (CRUD)
router.post('/delete', function(req,res,next) {
  var id = req.body.id;
  UserData.findByIdAndRemove(id).exec();
  res.redirect('/');
});

// delete from button
router.get('/deletebtn/:id', function(req,res,next) {
  var id = req.params.id;
  UserData.findByIdAndRemove(id).exec();
  res.redirect('/data');
});

// update (CRUD)
router.post('/update', function(req,res,next){
  var id = req.body.id;

  UserData.findById(id, function(err,doc){
    if (err) {
      console.error('error, no entry found');
    }

    doc.title = req.body.title;
    doc.content = req.body.content;
    doc.author = req.body.author;
    doc.save();
  });
  res.redirect('/');
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { items: {} });
});

module.exports = router;
