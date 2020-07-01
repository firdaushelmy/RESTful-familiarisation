const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
require('dotenv').config()
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const port = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL
mongoose.connect(`${MONGO_URL}`, { useNewUrlParser: true, useUnifiedTopology: true })

const articlesSchema = ({
  title: { type: String, required: true },
  content: { type: String, required: true },
})

const listsSchema = {
  name: { type: String, required: true },
  articles: [articlesSchema],
}

const Article = mongoose.model('Article', articlesSchema);
const List = mongoose.model('List', listsSchema);

app.get('/articles', function (req, res) {
  Article.find({}, function (err, result) {
    if (result.length === 0) {
      List.create({
        name: 'Article List',
      }, function (err, list) {
        if (err) {
          return handleError(err);
        }
      })
      Article.create({
        title: 'testing one two three',
        content: 'pewpewpew'
      }, function (err, article) {
        if (err) {
          return handleError(err);
        }
      })
      res.redirect('/');
    }
    if (result.length !== 0) {
      res.send(result);
    }
  })
})

app.post('/articles', function (req, res) {
  const article = new Article({
    title: req.body.title,
    content: req.body.content,
  })
  article.save()
})

app.get('/new', function (req, res) {
  res.render('addEntry')
})

app.listen(port, function () {
  console.log(`server is running on ${port}`)
});

// connect database