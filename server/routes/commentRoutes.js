var express = require('express')
var router = express.Router()
const sql = require('../sql')
router.get('/get', function (req, res, next) {
  const {messageId, offset, limit} = req.query || {}
  if (!messageId) {
    res.json({
      code: -5,
      data: {}
    })
  }
  return Promise.all([sql.getComments(messageId, offset, limit), sql.getCommentsTotal(messageId)]).then(datas => {
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
  const {commentMessage, messageId, userId} = req.query || {}
  if (!commentMessage || !messageId || !userId) {
    res.json({
      code: -6,
      data: {}
    })
  }
  return sql.addComment({commentMessage, messageId, userId}).then(data => {
    res.json({
      code: 0,
      data: {}
    })
  })
})
router.get('/del', function (req, res, next) {
  const {messageId, userId} = req.query || {}
  if (!userId || !messageId) {
    res.json({
      code: -5,
      data: {}
    })
  }
  return sql.delComment({messageId, userId}).then(data => {
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
