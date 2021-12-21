const sql = require('./sql')
const TTL = 900000
const updateTTL = 20000
module.exports = {
  autoUpdateSession (app) {
    app.use(async function (req, res, next) {
      const {user_id, session_id} = req.cookie || {}
      const data = await sql.getSessionByUserIdAndSessionId(user_id, session_id)
      if (data) {
        const nowTime = new Date().getTime()
        // 节流一下，超过20s就更新一下吧
        if (nowTime - data.login_time < TTL && nowTime - data.login_time > updateTTL) {
          await sql.updateSession({userId: user_id, sessionId: session_id, loginTime: nowTime})
        }
      }
      next()
    })
  }
}
