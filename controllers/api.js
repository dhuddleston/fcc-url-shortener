var express = require('express');
var validUrl = require('valid-url');

// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

var ShortUrl = require('../models/shortUrl');
var router = express.Router();

// Using module.exports so that the Express app and database can be used
module.exports = function(app, mongoose){
    router.route('/url')
    .get(function(req, res){
       ShortUrl.find({ShortUrl: req}, function(err, result){
          if(err) throw err;
          if(result)
          {
              console.log('Found original url: ' + result);
              res.redirect(result.originalUrl);
          }
          else
          {
              res.send({
                 "error": "The requested URL was not found in the database." 
              });
          }
       }); 
    });
    
    app.get('/new/:url', postUrl);
    
    function postUrl(req, res){
        var shortUrl = new ShortUrl();
        var url = req.url;
        if(validUrl.isUri(url))
        {
            shortUrl.originalUrl=url;
            shortUrl.shortenedUrl= process.env.APP_URL + makeShortUrl();
            shortUrl.error = null;
            
            shortUrl.save(function(err){
               if(err)
               {
                   res.send(err);
               }
            });
        }
        else
        {
            res.send("Not a valid URL. Please try again");
        }
    }
    
    function makeShortUrl(){
        var shortNum = Math.floor(Math.random() * 9999) + 1000;
        return shortNum.toString();
    }
    
};