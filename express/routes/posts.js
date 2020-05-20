const express = require('express');
const router = express.Router();

router.get('/posts/:title', (req, res) => {
   console.log("FCUKINNN HELLOOOO");
   let posts = {};
   fs.readdir('./posts', (err, files) => {
      if(!err){
         for(i in files){
            let splitpost = files[i].split("$");
            posts[splitpost[1]] = {};
            posts[splitpost[1]]["date"] = splitpost[0];
            fs.readFile('./posts/'+files[i], 'utf8', (err, data) => {
               if (!err){
                  posts[splitpost[1]]["content"] = data.toString();
               }
            });
         }
      }
   });
   req.params["title"] = req.params["title"].replace('_', ' ');
   console.log(req.params["title"]+"REEEEE");
   if(posts[req.params["title"]]) res.send(posts[req.params["title"]]);
   else res.send(0);
});

module.exports = router;
