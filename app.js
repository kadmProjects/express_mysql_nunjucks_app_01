const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const methodOverride = require('method-override');
const path = require('path');
const app = express();

const port = 3000;
const db = mysql.createConnection ({
   host: 'localhost',
   user: 'root',
   password: '123456',
   database: 'node_mysql_crud_01'
});

// connect to database
db.connect((err) => {
   if (err) {
       throw err;
   }
   console.log('Connected to database');
});
global.db = db;

app.set('port', process.env.port || port);
app.set('views', path.join(__dirname, 'views'));
// Specify the file extension of view files.
app.set('view engine', 'nunjucks');
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // parse form data client
app.use(express.static(path.join(__dirname, 'public')));

/**
 * using custom logic to override method
 * 
 * there are other ways of overriding as well
 * like using header & using query value

app.use(methodOverride(function (req, res) {
   if (req.body && typeof req.body === 'object' && '_method' in req.body) {
     // look in urlencoded POST bodies and delete it
     var method = req.body._method
     delete req.body._method
     return method
   }
 }))
*/

nunjucks.configure('views', {
   autoescape: true,
   express: app
});


app.get('/', (req, res, next) => {
   let query = "SELECT * FROM movies;";
   db.query(query, (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.render('home', {
         movies: result
      });
  });
});

app.get('/home', (req, res, next) => {
   let query = "SELECT * FROM movies;";
   db.query(query, (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.render('home', {
         movies: result
      });
  });
});

app.get('/home/create', (req, res, next) => {
   res.render('create');
});

app.post('/home/store', (req, res, next) => {
   var data = req.body;
   let query = "INSERT INTO movies (name, director, main_actor, production_company, main_actress, released_date) values('" + data.movie_name + "', '" + data.director +"', '" + data.main_actor + "', '" + data.company + "', '" + data.main_actress + "', '" + data.released_date + "');";
   db.query(query, (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.redirect('/');
  });
});

app.get('/home/edit/(:id)', (req, res, next) => {
   var id = req.params.id;
   let query = "SELECT * FROM movies WHERE id ='" + id + "';";
   db.query(query, (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.render('edit', {
         movie: result[0]
      });
  });
});

app.put('/home/update', (req, res, next) => {
   var data = req.body;
   let query = "UPDATE movies SET name='" + data.movie_name + "', director='" + data.director +"', main_actor='" + data.main_actor + "', production_company='" + data.company + "', main_actress='" + data.main_actress + "', released_date='" + data.released_date + "' WHERE id=" + data.id + ";";
   db.query(query, (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.redirect('/');
  });
});


app.get('/home/show/(:id)', (req, res, next) => {
   var id = req.params.id;
   let query = "SELECT * FROM movies WHERE id ='" + id + "';";
   db.query(query, (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.render('show', {
         movie: result[0]
      });
  });
});

app.delete('/home/delete', (req, res, next) => {
   var data = req.body;
   let query = "DELETE FROM movies WHERE id ='" + data.id + "';";
   db.query(query, (err, result) => {
      if (err) {
          return res.status(500).send(err);
      }
      res.redirect('/');
  });
});

// app.listen(process.env.PORT || port, () => console.log('App listening on port ' + port));
app.listen(port, () => {
   console.log('Server running on port: ' + port);
});