const {sessionGenerator} = require('./sessionGenerator')

const sql = require('./sql')
const TTL = 900000
const updateTTL = 20000
module.exports = {
  autoUpdateSession (app) {
    app.use(async function (req, res, next) {
      const {user_id, session_id} = req.cookies || {}
      console.log('##### autoUpdateSession', JSON.stringify(req.cookies))
      if (user_id && session_id) {
        const data = await sql.getSessionByUserIdAndSessionId(user_id, session_id)
        if (data && data.user_id) {
          console.log('##### autoUpdateSession', data)
          const nowTime = new Date().getTime()
          req.userInfo = data
          // 节流一下，超过20s就更新一下吧
          if (nowTime - data.login_time < TTL && nowTime - data.login_time > updateTTL) {
            console.log('##### autoUpdateSession auto update')
            await sql.updateSession({userId: user_id, sessionId: session_id, loginTime: nowTime})
            res.cookie('user_id', `${user_id}`, {maxAge: 900000, httpOnly: true})
            res.cookie('session_id', `${session_id}`, {maxAge: 900000, httpOnly: true})
          }
        }
      } else {
        // 游客，或者登录态过期
        console.log('##### 游客')
        const userName = `游客_${new Date().getTime()}`
        const password = ''
        await sql.addUser({userName, password, userType: 0})
        let data = await sql.getUserByUserNameAndPassword(userName, password)
        // 产生一个随机session，填充到数据库里边去，然后写到cookie里边
        const {user_id} = data
        const session_id = sessionGenerator()
        const loginTime = new Date().getTime()
        data = await sql.getSession(user_id)
        if (data) {
          // 更新吧
          req.userInfo = data
          await sql.updateSession({userId: user_id, sessionId: session_id, loginTime})
        } else {
          await sql.addSession({userId: user_id, sessionId: session_id, loginTime})
          data = await sql.getSession(user_id)
          req.userInfo = data
          await sql.updateSession({userId: user_id, sessionId: session_id, loginTime})
        }

        // 15分钟失效？
        res.cookie('user_id', `${user_id}`, {maxAge: 900000, httpOnly: true})
        res.cookie('session_id', `${session_id}`, {maxAge: 900000, httpOnly: true})
      }
      next()
    })
  }
}
