const {sqlQuery} = require('./sql.js')
module.exports = {
  getMessages (offset = 0, limit = 20) {
    const sql = `select * from message_table order by create_time desc limit ${limit} offset ${offset};`
    return sqlQuery(sql).then(data => data)
  },
  getMessagesByIds (messageIds) {
    const sql = `select * from message_table where message_id in (${messageIds.join(',')})`
    return sqlQuery(sql).then(data => data)
  },
  getMessagesTotal () {
    const sql = `select count(*) as count from message_table;`
    return sqlQuery(sql).then(data => data[0])
  },
  getMessagesByUser (userId, offset = 0, limit = 20) {
    const sql = `select * from message_table where user_id=${userId} order by create_time desc limit ${limit} offset ${offset};`
    return sqlQuery(sql).then(data => data[0])
  },
  getMessagesByUserTotal (userId) {
    const sql = `select * from message_table where user_id=${userId};`
    return sqlQuery(sql).then(data => data[0])
  },
  addMessage ({message, userId}) {
    const sql = `insert into message_table (message, user_id) values ('${message}', ${userId});`
    return sqlQuery(sql).then(data => data[0]).then(data => data)
  },
  delMessage ({messageId, userId}) {
    const sql = `delete from message_table where message_id = ${messageId} and user_id=${userId};`
    return sqlQuery(sql).then(data => data)
  }
}
