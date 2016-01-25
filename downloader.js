var uuid = require('node-uuid'),
    fs = require('fs'),
    request = require('request');

module.exports = {

  download: function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);

      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  },
  download_temp: function(uri, callback) {
    var filename = "./tmp/" + uuid.v1() + ".tmp";
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);

      request(uri).pipe(fs.createWriteStream(filename)).on('close', function() {
        callback(filename, res.headers['content-type'])
      });
    });
  }
}
