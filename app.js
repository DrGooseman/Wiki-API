const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

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

app
  .route("/articles")
  .get(function(req, res) {
    article.find(function(err, articles) {
      if (!err) res.send(articles);
      else res.send(err);
    });
  })
  .post(function(req, res) {
    const newArticle = new article({
      title: res.body.title,
      content: res.body.content
    });

    newArticle.save(function(err) {
      if (!err) res.send("Successfully added a new article.");
      else res.send(err);
    });
  })
  .delete(function(req, res) {
    Article.deleteMany(function(err) {
      if (!err) res.send("Successfully deleted all articles.");
      else res.send(err);
    });
  });

app
  .route("/articles/:articleTitle")
  .get(function(req, res) {
    Article.findOne({ title: req.params.articleTitle }, function(err, article) {
      if (article) res.send(article);
      else res.send("No articles found.");
    });
  })
  .put(function(req, res) {
    Article.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      { overwrite: true },
      function(err) {
        if (err) {
          res.send("Successfully updated the article.");
        }
      }
    );
  })
  .patch(function(req, res) {
    Article.update(
      { title: req.params.articleTitle },
      { $set: req.body },
      function(err) {
        if (!err) res.send("Successfully updates the article.");
        else res.send(err);
      }
    );
  })
  .delete(function(req, res) {
    Article.deleteOne({ title: req.params.articleTitle }, function(err) {
      if (!err) res.send("Successfully deleted the article.");
      else res.send(err);
    });
  });

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000");
});
