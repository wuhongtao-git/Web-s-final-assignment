const mysql = require('mysql')
const configDefault = require('../../config.default')
module.exports = {
  // 直接传sql，实际上不安全
  sqlQuery (sqlStr) {
    var connection = mysql.createConnection({
      host: configDefault.sqlHost,
      user: configDefault.sqlUser,
      password: configDefault.sqlPassword,
      database: configDefault.sqlDatabase,
      insecureAuth: true
    })
    connection.connect()
    return new Promise((resolve, reject) => {
      connection.query(sqlStr, function (err, rows, fields) {
        if (err) {
          reject(err)
        } else {
          console.log('The solution is: ', rows[0].solution)
          resolve(rows)
        }
      })
      connection.end()
    })
  }
}
