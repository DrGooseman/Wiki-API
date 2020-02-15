const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true
});

const articleSchema = {
  title: String,
  content: String
};

const article = mongoose.model("Article", articleSchema);

app.get("/articles", function(req, res) {
  article.find(function(err, articles) {
    if (!err) res.send(articles);
    else res.send(err);
  });
});

app.post("/articles", function(req, res) {
  const newArticle = new article({
    title: res.body.title,
    content: res.body.content
  });

  newArticle.save(function(err) {
    if (!err) res.send("Successfully added a new article.");
    else res.send(err);
  });
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});
