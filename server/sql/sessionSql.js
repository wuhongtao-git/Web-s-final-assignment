const {sqlQuery} = require('./sql.js')
module.exports = {
  getSession (userId) {
    const sql = `select * from session_table where user_id = ${userId};`
    return sqlQuery(sql).then(data => data[0])
  },
  getSessionByUserIdAndSessionId (userId, sessionId) {
    const sql = `select * from session_table where user_id = ${userId} and session_id='${sessionId}';`
    return sqlQuery(sql).then(data => data[0])
  },
  addSession ({userId, sessionId, loginTime}) {
    const sql = `insert into session_table (user_id, session_id, login_time) values (${userId}, '${sessionId}', '${loginTime}');`
    return sqlQuery(sql).then(data => data)
  },
  updateSession ({userId, sessionId, loginTime}) {
    const sql = `update session_table set login_time='${loginTime}', session_id='${sessionId}' where user_id=${userId} ;`
    return sqlQuery(sql).then(data => data)
  },
  delSession ({userId}) {
    const sql = `update session_table set login_time='0', session_id='' where user_id=${userId} ;`
    return sqlQuery(sql).then(data => data)
  }
}
