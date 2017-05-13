
//REQUIRE modules
const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const shorturl = require('./models/shorturl')
app.use(bodyparser.json());
app.use(cors());

// connect to database
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/shorturl');


app.use(express.static(__dirname + "/public"));

//This is used to create database Entry.

app.get("/new/:urlshortened(*)",(req , res , next)=>{
  var  urlshortened = req.params.urlshortened;
  console.log(urlshortened);
  //regular expression for url 
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-z0-9@:%_\+.~#?&//=]*)?/gi;
  
  var regex = expression ;
  
  if(regex.test(urlshortened)==true){
    var short = Math.floor(Math.random()*1000).toString();
    
    var data = new shorturl (
      {
      originalURL: urlshortened,
      shorterUrl: short
      }
    );
    
    data.save(err=>{
      if(err){
        return res.send("Error in saving to database");
      }
      
    });
    
  return res.json(data);
  }
  var data = new shorturl({
    originalURL: urlshortened,
    shorterUrl: 'Sorry wrong URL enter corect one '
  });
  return res.json(data);
  
 
});


//forward by taking short url to original link 

app.get('/:urlToForward',(req , res , next )=>{
  //stores value of parameters
  var shorter = req.params.urlToForward;
  
  shorturl.findOne({'shorterUrl': shorter},(err,data)=>{
    if (err)   return res.send('error reading database')
var rege = new RegExp("^(http|https)://","i");

var checking = data.originalURL;
if(rege.test(checking)){
  res.redirect(301,data.originalURL);
}
    else{
      res.redirect(301,'http://'+data.originalURL )
    }
  });
});


//process.env.port used if you dont know the port number i.e when you are using in Heroku app.
app.listen(process.env.PORT || 8080,()=>{  //call back funtion as per (ES6) , (ES5) format was function(){}
  console.log("everyting is working!!");
});