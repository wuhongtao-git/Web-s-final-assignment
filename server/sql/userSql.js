const {sqlQuery} = require('./sql.js')
module.exports = {
  getUser (userId) {
    const sql = `select * from user_table where user_id = ${userId};`
    console.log('getUser', sql)
    return sqlQuery(sql)
  },
  // user id 还是要随机生成des
  addUser ({userName, password, userType}) {
    const sql = `insert into user_table (user_name, password, user_type) values (${userName}, ${password}, ${userType});`
    return sqlQuery(sql)
  },
  updateUser ({userId, userName, password, userType}) {
    const sql = `update user_table set user_name=${userName}, password=${password}, user_type=${userType} where user_id=${userId} ;`
    return sqlQuery(sql)
  }
}
