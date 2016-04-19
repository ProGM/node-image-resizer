var process = require('process'),
    downloader = require('./downloader.js'),
    url = require('url');


module.exports = function(app) {
  function downloadFile(path_name, prepend_url, req, res, callback) {
    var parsed_url = url.parse(req.url, true);
    var path_name = path_name.replace(/\/:([a-z]+)\//g, "/[^/]+/");
    var new_path = new RegExp("^" + path_name.replace('*', ''))

    var real_path = parsed_url.path.replace(new_path, '');

    if (prepend_url) {
      real_path = prepend_url + '/' + real_path;
    }
    console.log(real_path);

    downloader.download_temp(real_path, function(filename, type) {
      callback(req, res, filename, type);
    }, function() {
      console.log("File not found: " + real_path);
      res.status(404);
      res.type('txt').send('Not found');
    });
  }

  return {
    get: function(prepend_url, path, callback) {
      var new_callback = function(req, res) {
        downloadFile(path, prepend_url, req, res, callback);
      }
      app.get.apply(app, [path, new_callback]);
    },
    listen: function(port) {
      app.listen(port);
    }
  }
}
