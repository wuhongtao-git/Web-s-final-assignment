const userRoutes = require('./userRoutes')
const messageRoutes = require('./messageRoutes')
const commentRoutes = require('./commentRoutes')
const collectRoutes = require('./collectRoutes')

module.exports = {
  startRoute (app) {
    app.use('/user', userRoutes)
    app.use('/message', messageRoutes)
    app.use('/comment', commentRoutes)
    app.use('/collect', collectRoutes)
  }
}
