const express = require('express'),
  app = express(),
  router = express.Router(),
  path = require('path')

let port = process.env.PORT || 3000

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html')
})

app.listen(port)
console.log('Express listening on port ' + port);
