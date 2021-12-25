const {sqlQuery} = require('./sql.js')
module.exports = {
  getUser (userId) {
    const sql = `select * from user_table where user_id = ${userId};`
    return sqlQuery(sql).then(data => data[0])
  },
  getUserByUserName (userName) {
    const sql = `select * from user_table where user_name = '${userName}';`
    return sqlQuery(sql).then(data => data[0])
  },
  getUserByUserNameAndPassword (userName, password) {
    const sql = `select * from user_table where user_name = '${userName}' and password = '${password}';`
    return sqlQuery(sql).then(data => data[0])
  },
  addUser ({userName, password, userType}) {
    const sql = `insert into user_table (user_name, password, user_type) values ('${userName}', '${password}', ${userType});`
    return sqlQuery(sql).then(data => data)
  },
  updateUser ({userId, userName, password, userType }) {
    const sql = `update user_table set user_name='${userName}', password='${password}', user_type=${userType} where user_id=${userId} ;`
    return sqlQuery(sql).then(data => data)
  }
}
