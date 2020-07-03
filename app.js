const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const { get } = require('http');
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

app.route('/articles')

  .get(function (req, res) {
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
    });
  })

  .post(function (req, res) {
    const article = new Article({
      title: req.body.title,
      content: req.body.content,
    })
    article.save(function (err) {
      if (!err) {
        console.log('successfully added entry')
        return;
      }
      console.log(err)
    });
  })

  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        console.log('Database wiped clean');
        return;
      }
      console.log(err);
    })
    List.deleteMany(function (err) {
      if (!err) {
        console.log('list is Wiped');
        return;
      }
      console.log(err);
    })
  });

app.route('/articles/:articleTitle')

  .get(function (req, res) {
    Article.findOne({ title: req.params.articleTitle }, function (err, foundArticle) {
      if (foundArticle) {
        res.send(foundArticle);
        return;
      } console.log('entry not found')
    })
  })

  .put(function (req, res) {
    Article.update(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content, },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send('entry updated successfully');
          return;
        }
        console.log(err);
      })
  })

  .patch(function (req, res) {
    Article.update(
      { title: req.params.articleTitle },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send('successfully updated fields');
          return;
        } console.log(err);
      })
  })

  .delete(function (req, res) {
    Article.deleteOne(
      { title: req.params.articleTitle },
      function (err,) {
        if (!err) {
          res.send('entry successfully deleted');
          return;
        } console.log(err);
      })
  });

app.get('/new', function (req, res) {
  res.render('addEntry')
})

app.listen(port, function () {
  console.log(`server is running on ${port}`)
});
