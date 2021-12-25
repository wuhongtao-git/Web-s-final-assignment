var express = require('express')
var router = express.Router()
const sql = require('../sql')
router.get('/get', function (req, res, next) {
  const {offset, limit} = req.query || {}
  const {user_id: userId} = req.userInfo || {}
  if (!userId) {
    res.json({
      code: -5,
      data: {}
    })
  }
  return Promise.all([sql.getCollects(userId, offset, limit), sql.getCollectsTotal(userId)]).then(datas => {
    let list = datas[0] || []
    list = list.map(item => item.message_id)
    if (list.length === 0) {
      res.json({
        code: 0,
        data: {
          list: [],
          total: datas[1].count
        }
      })
    }
    return sql.getMessagesByIds(list).then(data => {
      res.json({
        code: 0,
        data: {
          list: data || [],
          total: datas[1].count
        }
      })
    })
  })
})

router.get('/add', function (req, res, next) {
  const {messageId} = req.query || {}
  const {user_id: userId} = req.userInfo || {}
  if (!messageId || !userId) {
    res.json({
      code: -6,
      data: {}
    })
  }
  return sql.addCollect({messageId, userId}).then(data => {
    res.json({
      code: 0,
      data: {}
    })
  })
})
router.get('/del', function (req, res, next) {
  const {collectId} = req.query || {}
  const {user_id: userId} = req.userInfo || {}
  if (!userId || !collectId) {
    res.json({
      code: -5,
      data: {}
    })
  }
  return sql.delCollect({collectId, userId}).then(data => {
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
