var http = require('http'),
uuid = require('node-uuid'),
imagemagick = require('imagemagick-native'),
request = require('request'),
process = require('process'),
fs = require('fs'),
dotenv = require('dotenv'),
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

if (dotenv) { dotenv.config(); }

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

  // console.log(req.params.size)
  // console.log(reduced_filename)
  // console.log(complete_path)

  var params = matcher(req.params.size, [["([0-9]+)x([0-9]+)([\^>]?)", 'width', 'height', 'type']])

  fs.writeFileSync(reduced_filename, imagemagick.convert({
      srcData: fs.readFileSync(complete_path),
      width: params.width,
      height: params.height,
      resizeStyle: 'aspectfit'
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
