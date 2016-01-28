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
  download_temp: function(uri, success, failure) {
    var filename = "./tmp/" + uuid.v1() + ".tmp";
    request.head(uri, function(err, res, body){
      console.log('status code:', res.statusCode);
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);
      if (res.statusCode == 200) {
        request(uri).pipe(fs.createWriteStream(filename)).on('close', function() {
          console.log()
          success(filename, res.headers['content-type'])
        });
      } else {
        failure(res, body);
      }
    });
  }
}
