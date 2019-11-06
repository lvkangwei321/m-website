const {
  src,
  dest,
  parallel,
  series,
  watch
} = require('gulp');
const connect = require('gulp-connect');
const path = require('path')
const sass = require('gulp-sass')
const webpack = require('webpack-stream')
const proxy = require('http-proxy-middleware')

function copyhtml() {
  return src("../*.html")
    .pipe(dest("../../dev/"))
    .pipe(connect.reload())
}

function copylibs() {
  return src("../libs/**/*")
    .pipe(dest("../../dev/libs/"))
    .pipe(connect.reload())
}

function copysass() {
  return src('../styles/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(dest('../../dev/styles/'))
    .pipe(connect.reload())
}

function copyassets() {
  return src('../assets/**/*')
    .pipe(dest('../../dev/assets'))
}

function copyJS() {
  return src("../scripts/**/app.js")
    .pipe(webpack({
      mode: 'development',
      entry: '../scripts/app.js',
      output: {
        path: path.resolve(__dirname, '../../dev/scripts'),
        filename: 'app.js'
      },
      module: {
        rules: [{
            test: /\.html$/,
            loader: 'string-loader'
          },
          {
            test: /\.art$/,
            loader: "art-template-loader"
          }
        ]
      }
    }))
    .pipe(dest('../../dev/scripts'))
    .pipe(connect.reload())
}

function server() {
  return connect.server({
    name: 'Dist App',
    root: '../../dev',
    port: 8080,
    livereload: true,
    // host:'10.9.49.54', 
    middleware: () => {
      return [
        proxy('/api', {
          target: 'http://localhost:3000',
          changeOrigin: true,
          pathRewrite: {
            '^/api': ''
          }
        }),
        proxy('/local', {
          target: 'http://10.9.49.232:80',
          changeOrigin: true,
          pathRewrite: {
            '^/local': ''
          }
        }),
      ]
    }
  })
}
function watchFiles() {
  watch('../*.html', series(copyhtml)),
    watch('../styles/**/*.scss', series(copysass)),
    watch('../scripts/**/*.js', series(copyJS)),
    watch('../libs/**/*', series(copylibs)),
    watch('../assets/*', series(copyassets))
}
exports.default = series(parallel(copyhtml, copyassets, copysass, copyJS, copylibs), parallel(server, watchFiles))