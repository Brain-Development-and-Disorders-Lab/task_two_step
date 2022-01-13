const {src, dest} = require('gulp');

// Copy the images from the local 'src' directory
// into the 'dist' directory after the JavaScript
// has been outputted
const copyImages = (cb) => {
  src([
    './src/images/*.png',
    './src/images/*.jpg',
  ]).pipe(dest('./dist/images'));
  cb();
};

exports.default = copyImages;
exports.images = copyImages;
