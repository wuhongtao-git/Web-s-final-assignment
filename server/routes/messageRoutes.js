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

router.get('/getCollection', function (req, res, next) {
  const {offset, limit} = req.query || {}
  const {user_id: userId} = req.userInfo || {}
  if (!userId) {
    res.json({
      code: -4,
      data: {}
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
router.get('/add', function (req, res, next) {
  const {message} = req.query || {}
  const {user_id: userId} = req.userInfo || {}
  if (!userId || !message) {
    res.json({
      code: -5,
      data: {}
    })
  }
  return sql.addMessage({message, userId}).then(data => {
    res.json({
      code: 0,
      data: {}
    })
  })
})
router.get('/del', function (req, res, next) {
  const {messageId} = req.query || {}
  const {user_id: userId} = req.userInfo || {}
  if (!userId || !messageId) {
    res.json({
      code: -5,
      data: {}
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
        code: -6,
        data: {}
      })
    }
  })
})
module.exports = router
