const mongoose = require("mongoose");
const Schema = mongoose.Schema ;
 
const urlschema = new Schema ({
     
     originalURL : String ,
     shorterUrl: String
     
 },{Timestamps:true});
 
 
 const ModelClass = mongoose.model('shorterUrl',urlschema);
 
 module.exports = ModelClass;