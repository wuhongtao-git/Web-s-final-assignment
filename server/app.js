var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var {startRoute} = require('./routes')
var {autoUpdateSession} = require('./autoUpdateSession')
var app = express()
const config = require('../config.default')
// 实际上这里可以改掉，这个模板太丑
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
// 这里只有开发环境，为了跨域，互通
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', `http://${config.vuePath}`)
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', ' 3.2.1')
  res.header('Access-Control-Allow-Credentials', 'true')
  req.method === 'OPTIONS' ? res.send(200) : next()
})
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

//  提供路由服务
// 提供路由服务前，搞一下登录态的自动续期，按理，是要有操作，自动续期
autoUpdateSession(app)
startRoute(app)

var history = require('connect-history-api-fallback')
app.use(express.static(path.join(__dirname, 'dist')))
app.use(history())
// ---------------------------------------------

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
