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

  var item = {
    title : req.body.title,
    content : req.body.content,
    author : req.body.author
  };

  var data = new UserData(item);

  // this saves and THEN finds the record id
  // just created and then finds
  // that record
  data.save(function(err,record){
    var newid = record._id;
    UserData.find({_id:newid})
      .then(function(doc){
        res.render('data', {items: doc});
      });
  });

  //res.redirect('/');

});

// get (CRUD)
router.get('/get-data', function(req,res,next){
  UserData.find()
    .then(function(doc){
      res.render('index', {items: doc});
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

/* GET new page */
router.get('/new', function(req, res, next) {
  res.render('new', { items: {}, title : "Insert new data" });
});

/* GET update page */
router.get('/update', function(req, res, next) {
  res.render('update', { items: {}, title : "Update data"  });
});

/* GET delete page */
router.get('/deletedoc', function(req, res, next) {
  res.render('deletedoc', { items: {}, title : "Delete data...must provide ID"   });
});

/* GET find page */
router.get('/find', function(req, res, next) {
  UserData.find()
    .then(function(doc){
      res.render('find', {items: doc, title : "Search and list data" });
    });
});

/* POST find results */
router.post('/finddoc', function(req,res,next){
  var search = req.body.search;
  UserData.find().or([{title: search}, {content: search}]) // this allows us to find the value in multiple fields
    .then(function(doc){
      res.render('find', {items: doc});
    });
});

/* GET data page */
router.get('/data', function(req,res,next){
  UserData.find()
    .then(function(doc){
      res.render('data', {items: doc, title : "Get all data"  });
    });
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: "The Home Page", somecontent : "This site is the BEST. Probably."});
});

module.exports = router;
