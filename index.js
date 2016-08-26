var uuid = require('node-uuid'),
process = require('process'),
image_proxy = require('./image_proxy.js'),
matcher = require('./params_matcher.js'),
resizer = require('./resizer.js'),
downloader = require('./downloader.js'),
is = require('type-is');

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
var ALLOWED_TYPES = (process.env.ALLOWED_TYPES || '').split(',')

var proxy = image_proxy(app);

function sendFile(res, file, content_type) {
  var options = {
    headers: {
      'Content-Type' : content_type
    },
    maxAge: parseInt(process.env.MAX_AGE) || 3600 * 24 * 365 * 1000
  }
  res.sendFile(file, options);
}

function sendOriginal(req, res, tempfile, content_type) {
  sendFile(res, __dirname + tempfile.substring(1), content_type);
}

proxy.get(false, '/external/:size/*', function(req, res, tempfile, content_type) {
  if (ALLOWED_TYPES.length > 0 && !is.is(content_type, ALLOWED_TYPES)) {
    console.log('Type', content_type, 'is not a valid mime type. Allowed:', ALLOWED_TYPES)
    sendOriginal(req, res, tempfile, content_type);
    return;
  }

  var complete_path = __dirname + tempfile.substring(1);
  var reduced_filename = __dirname + '/tmp/' + uuid.v4() + '.tmp';

  var params = matcher(req.params.size, [["([0-9]+)x([0-9]+)([\^]?)", 'width', 'height', 'type']])

  console.log("TYPE: ", params.type);

  var width = Math.max(1, Math.min(parseInt(params.width), 2000));
  var height = Math.max(1, Math.min(parseInt(params.height), 2000));

  var output = resizer.resize(complete_path, reduced_filename, width, height, params.type);

  sendFile(res, output, content_type);
});

proxy.get(process.env.IMAGE_URL, '/original/*', sendOriginal);

proxy.get(process.env.IMAGE_URL, '/:size/*', function(req, res, tempfile, content_type) {
  if (ALLOWED_TYPES.length > 0 && !is.is(content_type, ALLOWED_TYPES)) {
    console.log('Type', content_type, 'is not a valid mime type. Allowed:', ALLOWED_TYPES)
    sendOriginal(req, res, tempfile, content_type);
    return;
  }

  var reduced_filename = __dirname + '/tmp/' + uuid.v4() + '.tmp';
  var complete_path = __dirname + tempfile.substring(1);

  var params = matcher(req.params.size, [["([0-9]+)x([0-9]+)([\^]?)", 'width', 'height', 'type']])

  console.log("TYPE: ", params.type);

  var width = Math.max(1, Math.min(parseInt(params.width), 2000));
  var height = Math.max(1, Math.min(parseInt(params.height), 2000));

  var output = resizer.resize(complete_path, reduced_filename, width, height, params.type);

  sendFile(res, output, content_type);
});

proxy.listen(process.env.PORT || 8000);
