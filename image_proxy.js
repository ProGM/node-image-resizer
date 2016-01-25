var process = require('process'),
    downloader = require('./downloader.js'),
    url = require('url');


module.exports = function(app) {
  function downloadFile(path_name, req, res, callback) {
    var parsed_url = url.parse(req.url, true);
    var path_name = path_name.replace(/\/:([a-z]+)\//g, "/[^/]+/");
    var new_path = new RegExp("^" + path_name.replace('/*', ''))

    var real_path = process.env.IMAGE_URL + parsed_url.path.replace(new_path, '')
    console.log(real_path);

    downloader.download_temp(real_path, function(filename, type) {
      callback(req, res, filename, type);
    });
  }

  return {
    get: function() {
      var new_arguments = arguments;
      var last_argument = new_arguments[new_arguments.length - 1];

      new_arguments[new_arguments.length - 1] = function(req, res) {
        downloadFile(new_arguments[0], req, res, last_argument);
      }
      app.get.apply(app, new_arguments);
    },
    listen: function(port) {
      app.listen(port);
    }
  }
}
