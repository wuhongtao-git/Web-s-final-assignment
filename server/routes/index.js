const testRoutes = require('./test')
const userRoutes = require('./user')

module.exports = {
  startRoute (app) {
    app.use('/test', testRoutes)
    app.use('/user', userRoutes)
  }
}
