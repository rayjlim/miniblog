var ftp = require('vinyl-ftp');
var gutil = require('gulp-util');
var minimist = require('minimist');
var args = minimist(process.argv.slice(2));
gulp.task('deploy', function() {
  var remotePath = '/public_html/travis-test';
  var conn = ftp.create({
    host: '50.63.37.1',
    user: args.user,
    password: args.password,
    log: gutil.log
  });
  gulp.src(['index.html', './**/*.css'])
    .pipe(conn.newer(remotePath))
    .pipe(conn.dest(remotePath));
});