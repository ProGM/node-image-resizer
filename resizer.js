var imagemagick = require('imagemagick-native'),
    fs = require('fs');

module.exports = (function() {
  function resize(source, output, width, height, type) {
    try {
      fs.writeFileSync(output, imagemagick.convert({
          srcData: fs.readFileSync(source),
          width: width,
          height: height,
          resizeStyle: type == '^' ? 'aspectfill' : 'aspectfit',
          gravity: 'Center',
          quality: 50
      }));
      return output;
    } catch (Error) {
      return source;
    }
  }
  return {
    resize: resize
  }
})();