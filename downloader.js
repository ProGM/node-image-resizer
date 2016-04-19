var uuid = require('node-uuid'),
    fs = require('fs'),
    request = require('request');

module.exports = (function() {

  function download(uri, filename, success, failure){

    var site_response;

    request({
      url: uri,
      headers: {
        "User-Agent" : "Request"
      }
    })
    .on('response', function(response) {
      console.log(response.statusCode) // 200
      console.log(response.headers['content-type']) // 'image/png'
      if (response.statusCode == 200) {
        site_response = response;
      } else {
        failure(response);
      }
    })
    .pipe(fs.createWriteStream(filename)).on('close', function() {
      if (site_response) {
        success(site_response);
      }
    });
  }
  function download_temp(uri, success, failure) {
    var filename = "./tmp/" + uuid.v1() + ".tmp";
    console.log(filename)
    download(uri, filename,
      function(res) {
        success(filename, res.headers['content-type']);
      }, failure);
  }

  return {
    download: download,
    download_temp: download_temp
  }
})();
