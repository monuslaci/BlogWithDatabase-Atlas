//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


const homeStartingContent = "Welcome to my basic blog site. The page is created using Express.js, Node.js and EJS. The blog posts are stored in mongoDB and stored in Atlas cloud";

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {


  Post.find({}, function (err, posts) {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        postArticle: posts
    
      });
      console.log(posts);
    }
  })

});



app.get("/compose", function (req, res) {
res.render("compose")

});

app.post("/compose", function (req, res) {
  var artTitle=req.body.articleTitle;
  var artContent=req.body.articleContent;

    var posts = new Post({ title: artTitle, content: artContent });
    posts.save(function(err) {
      if (err) return console.error(err);
      console.log("Document inserted succussfully!");
      res.redirect("/");
    });
});



app.post("/reset", function (req, res) {
  Post.deleteMany( { } , function(err) {
    if (err) {
        console.log(err)
    } else {
      console.log("Successfully deleted all documents")
    }
})

  var posts = new Post({ title: "Blog engine", content: homeStartingContent });
  posts.save(function(err) {
    if (err) return console.error(err);
    console.log("Document inserted succussfully!");
    res.redirect("/");
  });

});



app.get("/posts/:postId", function (req, res) {
  //catch the route parameter, that is now: postID that was sent from the home route
var postID=req.params.postId;

Post.findOne( {_id: postID } , function(err, foundArticle) {
  if (err) {
      console.log(err)
  } else {
    res.render("post", {article: foundArticle});
  }
})


  
  });


app.listen(process.env.PORT || 3000, function () {
  console.log("Server started on port 3000");
});