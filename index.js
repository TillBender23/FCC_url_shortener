require('dotenv').config();
const bodyParser = require("body-parser");
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('node:dns');
const url = require('url'); 

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// /api/shorturl endpoint
app.post('/api/shorturl', function(req, res, next){
  
  console.log(req.body.url);
  dns.lookup(url.parse(req.body.url).hostname, (err,address) => {
    console.log(err);
    if(err) {req.url_error = err.code;
      console.log('error_found: ' + req.url_error);
    }
  });
  console.log('1: ' + req.url_error);
  next();
 }, function(req, res) {
  console.log('2: ' + req.url_error);
    if (req.url_error == 'ENOTFOUND') {
      res.json({error: 'invalid url'})
    } else {
      res.json({original_url: req.body.url, short_url: 'short_url'});
    }    
  
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
