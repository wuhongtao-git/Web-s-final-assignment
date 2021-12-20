const userSql = require('./userSql.js')
const sessionSql = require('./sessionSql.js')
module.exports = {
  ...userSql,
  ...sessionSql
}
