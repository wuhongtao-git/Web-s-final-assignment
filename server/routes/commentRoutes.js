var express = require('express')
var router = express.Router()
const sql = require('../sql')
router.get('/get', function (req, res, next) {
  const {messageId, offset, limit} = req.query || {}
  if (!messageId) {
    res.json({
      code: -1,
      data: {
        message: '服务器错误'
      }
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

router.get('/add', async function (req, res, next) {
  const {commentMessage, messageId} = req.query || {}
  const {user_id: userId} = req.sessionInfo || {}
  console.log('################# comment add', JSON.stringify(req.sessionInfo), userId)
  if (!commentMessage || !messageId) {
    res.json({
      code: -1,
      data: {
        message: '服务器错误'
      }
    })
  }
  if (!userId) {
    res.json({
      code: -1,
      data: {
        message: '请先登录账号'
      }
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
  const {messageId} = req.query || {}
  const {user_id: userId} = req.sessionInfo || {}
  if (!messageId) {
    res.json({
      code: -1,
      data: {
        message: '服务器错误'
      }
    })
  }
  if (!userId) {
    res.json({
      code: -1,
      data: {
        message: '请先登录账号'
      }
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
