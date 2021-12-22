var express = require('express')
var router = express.Router()
const sql = require('../sql')
const {sessionGenerator} = require('../sessionGenerator')
router.get('/get', function (req, res, next) {
  const {userId} = req.query || {}
  return sql.getUser(userId).then(data => {
    if (data) {
      res.json({
        code: 0,
        data: {
          userData: {user_name: data.user_name, user_type: data.user_type}
        }
      })
    } else {
      res.json({
        code: -3,
        data: {}
      })
    }
  })
})
router.get('/register', function (req, res, next) {
  const {userName, password} = req.query || {}
  return sql.getUserByUserName(userName).then(data => {
    if (data) {
      // 重名
      res.json({
        code: -1,
        data: {
          message: '这个账号已被注册，请重新输入账号'
        }
      })
    } else {
      return sql.addUser({userName, password, userType: 1}).then(data => {
        return sql.getUserByUserNameAndPassword(userName, password).then(data => {
          // 产生一个随机session，填充到数据库里边去，然后写到cookie里边
          const {user_id} = data
          const session_id = sessionGenerator()
          const loginTime = new Date().getTime()
          return sql.getSession(user_id).then(data => {
            if (data) {
              // 更新吧
              return sql.updateSession({userId: user_id, sessionId: session_id, loginTime})
            } else {
              return sql.addSession({userId: user_id, sessionId: session_id, loginTime})
            }
          }).then(data => {
            // 15分钟失效？
            res.cookie('user_id', `${user_id}`, {maxAge: 900000, httpOnly: true})
            res.cookie('session_id', `${session_id}`, {maxAge: 900000, httpOnly: true})
            res.json({
              code: 0,
              data: {}
            })
          })
        })
      })
    }
  })
})
router.get('/login', function (req, res, next) {
  const {userName, password} = req.query || {}
  return sql.getUserByUserNameAndPassword(userName, password).then(data => {
    if (!data) {
      return {
        code: -2,
        data: {
          message: '账号或密码错误'
        }
      }
    } else {
      // 产生一个随机session，填充到数据库里边去，然后写到cookie里边
      const {user_id} = data
      const session_id = sessionGenerator()
      const loginTime = new Date().getTime()
      return sql.getSession(user_id).then(data => {
        if (data) {
          // 更新吧
          return sql.updateSession({userId: user_id, sessionId: session_id, loginTime})
        } else {
          return sql.addSession({userId: user_id, sessionId: session_id, loginTime})
        }
      }).then(data => {
        // 15分钟失效？
        res.cookie('user_id', `${user_id}`, {maxAge: 900000, httpOnly: true})
        res.cookie('session_id', `${session_id}`, {maxAge: 900000, httpOnly: true})
        return {
          code: 0,
          data: {}
        }
      })
    }
  })
})
module.exports = router
