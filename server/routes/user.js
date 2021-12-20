var express = require('express')
var router = express.Router()
const sql = require('../sql')
/* GET users listing. */
router.get('/get', function (req, res, next) {
  const query = req.query || {}
  return sql.getUser(query.userId).then(data => {
    res.json({
      code: 0,
      data: {
        userData: data
      }
    })
  })
})
module.exports = router
