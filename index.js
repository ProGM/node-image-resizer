var uuid = require('node-uuid'),
imagemagick = require('imagemagick-native'),
process = require('process'),
fs = require('fs'),
image_proxy = require('./image_proxy.js'),
matcher = require('./params_matcher.js'),
downloader = require('./downloader.js');


var express = require('express');
var app = express();

if (typeof String.prototype.startsWith != 'function') {
  String.prototype.startsWith = function (str){
    return this.slice(0, str.length) == str;
  };
}
if ( app.get('env') === 'development' ) {
  var dotenv = require('dotenv');
  if (dotenv) { dotenv.config(); }
}
var proxy = image_proxy(app);

proxy.get('/original/*', function(req, res, tempfile, content_type) {
  var options = {
    headers: {
      'Content-Type' : content_type
    },
    maxAge: 3600 * 24 * 365 * 1000
  }
  res.sendFile(__dirname + tempfile.substring(1), options);
});

proxy.get('/:size/*', function(req, res, tempfile, content_type) {
  var reduced_filename = __dirname + '/tmp/' + uuid.v4() + '.tmp';
  var complete_path = __dirname + tempfile.substring(1);

  var params = matcher(req.params.size, [["([0-9]+)x([0-9]+)([\^]?)", 'width', 'height', 'type']])

  console.log("TYPE: ", params.type);

  var width = Math.max(1, Math.min(parseInt(params.width), 2000));
  var height = Math.max(1, Math.min(parseInt(params.height), 2000));

  fs.writeFileSync(reduced_filename, imagemagick.convert({
      srcData: fs.readFileSync(complete_path),
      width: width,
      height: height,
      resizeStyle: params.type == '^' ? 'aspectfill' : 'aspectfit',
      gravity: 'Center',
      quality: 50
  }));

  var options = {
    headers: {
      'Content-Type' : content_type
    },
    maxAge: 3600 * 24 * 365 * 1000
  }
  res.sendFile(reduced_filename, options);
});

proxy.listen(process.env.PORT || 8000);
