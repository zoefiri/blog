const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const fs = require('fs');
const fusejs = require('fuse.js');
const cors = require('cors');

const app = express();
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.use(cors())
function getPosts(){
   return new Promise((resolve, reject) => {
      fs.readdir('./posts', (err, files) => {
         let posts = {};
         let splitpost;
         if(!err){
            files.forEach((file, i) => {
               if(file[0] != '.'){
                  contents = fs.readFileSync('./posts/'+file)
                  splitpost = file.split("$");
                  posts[splitpost[1]] = {};
                  posts[splitpost[1]]["date"] = splitpost[0];
                  posts[splitpost[1]]["title"] = splitpost[1];
                  posts[splitpost[1]]["content"] = contents.toString();
                  console.log(contents)
               }
            });
            resolve(posts);
         }
         else reject();
      });
   });
}

app.get('/posts/:title', (req, res) => {
   getPosts().then((posts) => {
      req.params["title"] = req.params["title"].replace('_', ' ');

      if(posts[req.params["title"]]){
         res.send(posts[req.params["title"]]);
      }
      else{
         res.send('0');
      }
   }, (rejected) => {
      res.send(rejected)
   }
   );
});

app.get('/postq/:query', (req, res) => {
   getPosts().then(
      (posts) => {
         const fuseOptions = {
            distance: 3000,
            threshold: .1,
            keys: [ "title", "content" ]
         };     
         const fuse = new fusejs(Object.values(posts), fuseOptions);
         query = req.params["query"].replace('_', ' ');
         res.send(fuse.search(query));
      },
      (rejected) => {
         res.send(rejected)
      });
});

// retrieve post count and sort by time
app.get('/postqt/:query', (req, res) => {
   getPosts().then(
      (posts) => {
         postlist = Object.values(posts);
         postlist = postlist.map(indice => {
            let itemWrapped = {};
            itemWrapped.item = indice;
            return itemWrapped;
         });
         postlist.sort((a,b) => (a.date > b.date) ? -1 : (a.date < b.date) ? 1 : 0);
         res.send(postlist.slice(0, Number(req.params.query)));
      },
      (rejected) => {
         res.send(rejected)
      });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
   next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
   // set locals, only providing error in development
   res.locals.message = err.message;
   res.locals.error = req.app.get('env') === 'development' ? err : {};

   // render the error page
   res.status(err.status || 500);
   res.render('error');
});

module.exports = app;
