var express = require('express')
var router = express.Router()
const sql = require('../sql')
router.get('/get', async function (req, res, next) {
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

router.get('/add', async function (req, res, next) {
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
  const userInfo = await sql.getUser(userId)
  if (userInfo.user_type !== 1) {
    res.json({
      code: -1,
      data: {
        message: '游客无法使用该功能'
      }
    })
  }
  // 判断是否收藏过
  const collectInfo = await sql.getCollectByMessageId(messageId, userId)
  if (collectInfo) {
    res.json({
      code: -1,
      data: {
        message: '重复收藏'
      }
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
  const {user_id: userId} = req.sessionInfo || {}
  if (!collectId) {
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
  // 游客不会进入到这里
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
