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

    // request.head(uri, function(err, res, body){
    //   console.log('content-type:', res.headers['content-type']);
    //   console.log('content-length:', res.headers['content-length']);

    //   // Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*;q=0.8
    //   // Accept-Encoding:gzip, deflate, sdch
    //   // Accept-Language:it-IT,it;q=0.8,en-US;q=0.6,en;q=0.4
    //   // Cache-Control:no-cache
    //   // Connection:keep-alive
    //   // Host:comefare.com
    //   // Pragma:no-cache
    //   // Referer:https://www.google.it/
    //   // Upgrade-Insecure-Requests:1
    //   // User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/49.0.2623.112 Safari/537.36
    // });
  }
  function download_temp(uri, success, failure) {
    var filename = "./tmp/" + uuid.v1() + ".tmp";
    console.log(filename)
    download(uri, filename,
      function(res) {
        success(filename, res.headers['content-type']);
      }, failure);
    // request.head(uri, function(err, res, body){
    //   console.log('status code:', res.statusCode);
    //   console.log('content-type:', res.headers['content-type']);
    //   console.log('content-length:', res.headers['content-length']);
    //   if (res.statusCode == 200) {
    //     request(uri).pipe(fs.createWriteStream(filename)).on('close', function() {
    //       console.log()
    //       success(filename, res.headers['content-type'])
    //     });
    //   } else {
    //     failure(res, body);
    //   }
    // });
  }

  return {
    download: download,
    download_temp: download_temp
  }
})();
