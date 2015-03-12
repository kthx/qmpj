var mongoose = require('mongoose');
var   config = {'url' : 'mongodb://localhost/qmpj'};
exports.mongoose = mongoose;

var mongoOptions =  { db: { safe: true } };
exports.dbConfig = config;
// Connect to Database
exports.db = mongoose.connect(config.url, mongoOptions, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + config.url + '. ' + err);
  } else {
    //console.log ('Successfully connected to: ' + config.url);
  }
});