const {src, dest} = require('gulp');
const rename = require('gulp-rename');

// Copy the images from the local 'src' directory
// into the 'dist' directory after the JavaScript
// has been outputted
const copyImages = (cb) => {
  src([
    './src/images/**/*.png',
    './src/images/**/*.jpg',
    './src/images/**/*.jpeg',
  ])
      .pipe(rename({dirname: ''}))
      .pipe(dest('./dist/images'));
  cb();
};

exports.default = copyImages;
exports.images = copyImages;
