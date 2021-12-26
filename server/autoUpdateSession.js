const {sessionGenerator} = require('./sessionGenerator')

const sql = require('./sql')
const TTL = 900000
const updateTTL = 20000
module.exports = {
  autoUpdateSession (app) {
    app.use(async function (req, res, next) {
      let {user_id, session_id} = req.cookies || {}
      console.log('##### autoUpdateSession', JSON.stringify(req.cookies))
      if (user_id) {
        // 自动续期
        if (session_id) {
          const data = await sql.getSessionByUserIdAndSessionId(user_id, session_id)
          if (data && data.user_id) {
            const nowTime = new Date().getTime()
            req.sessionInfo = data
            // 节流一下，超过20s就更新一下吧
            if (nowTime - data.login_time < TTL && nowTime - data.login_time > updateTTL) {
              console.log('##### autoUpdateSession auto update')
              await sql.updateSession({userId: user_id, sessionId: session_id, loginTime: nowTime})
              res.cookie('user_id', `${user_id}`, {maxAge: 2147483647, httpOnly: true})
              res.cookie('session_id', `${session_id}`, {maxAge: 900000, httpOnly: true})
            }
          }
          return next()
        } else {
          const userInfo = await sql.getUser(user_id)
          // 非游客，登录态过期了，就等着重新登陆吧
          if (userInfo.user_type === 1) {
            return next()
          }
        }
      }

      // 游客
      console.log('##### 游客')
      const userName = `游客_${new Date().getTime()}`
      const password = ''
      await sql.addUser({userName, password, userType: 0})
      let data = await sql.getUserByUserNameAndPassword(userName, password)
      // 产生一个随机session，填充到数据库里边去，然后写到cookie里边
      user_id = data.user_id
      session_id = sessionGenerator()
      const loginTime = new Date().getTime()
      data = await sql.getSession(user_id)
      if (data) {
        // 更新吧
        req.sessionInfo = data
        await sql.updateSession({userId: user_id, sessionId: session_id, loginTime})
      } else {
        await sql.addSession({userId: user_id, sessionId: session_id, loginTime})
        data = await sql.getSession(user_id)
        req.sessionInfo = data
        await sql.updateSession({userId: user_id, sessionId: session_id, loginTime})
      }

      // 15分钟失效？
      res.cookie('user_id', `${user_id}`, {maxAge: 2147483647, httpOnly: true})
      res.cookie('session_id', `${session_id}`, {maxAge: 900000, httpOnly: true})
      next()
    })
  }
}
