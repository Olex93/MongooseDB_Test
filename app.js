//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');

//GLOBAL VARIABLES
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//MONGOOSE SETUP
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:/blogSite', {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = mongoose.Schema({
  title:{
    type:String,
    required:true
  },
  content: {
    type:String,
    required:true
  },
  preview:{
    type:String,
    required:true
  },
  url:String
});

const Post = mongoose.model('Post', postSchema);


// firstPost.save(function(err, testPost){
//   if(err){
//     console.log(err);
//   }else{
//     console.log(testPost.title + " added to database");
//   }
// });

// GET REQUESTS
app.get("/", function(req,res){
  Post.find({}, function(err, foundItems){
    if (!err){
      res.render("home", {homeStartingContent:homeStartingContent, posts:foundItems});
    }else{
      console.log(err);
    }
  });

});

app.get("/about", function(req,res){
  res.render("about", {aboutStartingContent:aboutContent});
});

app.get("/contact", function(req,res){
  res.render("contact", {contactStartingContent:contactContent});
});

app.get("/compose", function(req,res){
  res.render("compose");
});



// to open a specific post
app.get("/:customURL", function(req, res){
  //identify url entry from the get param, turn lowercase using lodash npm package
  let searchedURL = _.kebabCase(req.params.customURL);
  Post.findOne({url:searchedURL}, function(err, foundPost){
    if(err){
      console.log(err);
    }else{
      res.render("post", {postTitle: foundPost.title, postBody: foundPost.content});
    }
  });
});


//POST REQUESTS
app.post("/compose", function(req, res){
  const post = new Post ({
    title: req.body.postTitle,
    content:req.body.postContent,
    preview:req.body.postContent.slice(0,99),
    url:_.kebabCase(req.body.postTitle)
  })
  post.save(function(err, addedPost){
    if(err){
      console.log(err);
    }else{
      console.log(addedPost.title + " successfully added to db");
    }
  });
  res.redirect("/");
});




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
