var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var logger = require('morgan')

var indexRouter = require('./routes/index')
var userRouter = require('./routes/user')
var testRouter = require('./routes/test')
var app = express()

// 实际上这里可以改掉，这个模板太丑
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
// 这里只有开发环境，为了跨域，互通
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', ' 3.2.1')
  req.method == 'OPTIONS' ? res.send(200) : next()
})
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// ----------------这两行被我们注释掉了-----------
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
// ---------------------------------------------
//  提供路由服务
app.use('/test', testRouter)
app.use('/user', userRouter)

// ----------------这三行是我们新添加的-----------
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
