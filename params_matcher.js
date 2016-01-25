module.exports = function(string, params) {
  for (var i = 0; i < params.length; i++) {
    var matches = new RegExp(params[i][0]).exec(string);
    if (matches != null) {
      var result = {};
      for (var j = 1; j < matches.length; j++) {
        if (params[i][j] !== undefined) {
          result[params[i][j]] = matches[j];
        }
      }
      return result;
    }
  }
  return false;
}
