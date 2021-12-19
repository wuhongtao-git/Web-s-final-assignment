var express = require('express')
var router = express.Router()

/* GET home page. */
router.get('/', function (req, res, next) {
  res.json({
    code: 0,
    data: {
      message: '返回测试数'
    }
  })
})

module.exports = router
