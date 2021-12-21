const userSql = require('./userSql.js')
const sessionSql = require('./sessionSql.js')
const messageSql = require('./messageSql.js')
const commentSql = require('./commentSql.js')
const collectSql = require('./collectSql')
module.exports = {
  ...userSql,
  ...sessionSql,
  ...messageSql,
  ...commentSql,
  ...collectSql
}
