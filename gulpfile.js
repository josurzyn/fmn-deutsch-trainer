var gulp = require('gulp');
var bs = require('browser-sync').create();
var reload = bs.reload;

gulp.task('serve', function() {
  bs.init({
    server: {
      baseDir: "./"
    },
    notify: false
  });

  gulp.watch("*.html").on("change", reload);
  gulp.watch("./app/css/*.css").on("change", reload);
  gulp.watch("./app/js/*.js").on("change", reload);
});
