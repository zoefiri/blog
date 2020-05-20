const fetch = require('node-fetch')
fetch("http://localhost:3001/posts/example_post")
        .then(res => res.text())
