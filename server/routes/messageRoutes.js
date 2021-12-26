var express = require('express')
var router = express.Router()
const sql = require('../sql')
router.get('/get', function (req, res, next) {
  const {offset, limit} = req.query || {}
  return Promise.all([sql.getMessages(offset, limit), sql.getMessagesTotal()]).then(datas => {
    res.json({
      code: 0,
      data: {
        list: datas[0] || [],
        total: datas[1].count
      }
    })
  })
})

router.get('/getMy', async function (req, res, next) {
  const {offset, limit} = req.query || {}
  const {user_id: userId} = req.sessionInfo || {}
  if (!userId) {
    res.json({
      code: -1,
      data: {
        message: '请先登录账号'
      }
    })
  }
  const userInfo = await sql.getUser(userId)
  if (userInfo.user_type !== 1) {
    res.json({
      code: -1,
      data: {
        message: '游客无法使用该功能'
      }
    })
  }
  return Promise.all([sql.getMessagesByUser(userId, offset, limit), sql.getMessagesByUserTotal(userId)]).then(datas => {
    res.json({
      code: 0,
      data: {
        list: datas[0] || [],
        total: datas[1].count
      }
    })
  })
})
router.get('/add', async function (req, res, next) {
  const {message} = req.query || {}
  const {user_id: userId} = req.sessionInfo || {}
  if (!userId) {
    res.json({
      code: -1,
      data: {
        message: '请先登录账号'
      }
    })
  }
  return sql.addMessage({message, userId}).then(data => {
    res.json({
      code: 0,
      data: {}
    })
  })
})
router.get('/del', async function (req, res, next) {
  const {messageId} = req.query || {}
  const {user_id: userId} = req.sessionInfo || {}
  if (!userId) {
    res.json({
      code: -1,
      data: {
        message: '请先登录账号'
      }
    })
  }
  return sql.delMessage({messageId, userId}).then(data => {
    if (data) {
      res.json({
        code: 0,
        data: {}
      })
    } else {
      res.json({
        code: -1,
        data: {
          message: '服务器错误'
        }
      })
    }
  })
})
module.exports = router
