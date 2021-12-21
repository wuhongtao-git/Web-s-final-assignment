const {sqlQuery} = require('./sql.js')
module.exports = {
  getMessages (offset = 0, limit = 20) {
    const sql = `select * from message_table order offset ${offset} limit ${limit} offset  by create_time desc;`
    return sqlQuery(sql).then(data => data[0])
  },
  getMessagesTotal () {
    const sql = `select count(*) from message_table;`
    return sqlQuery(sql).then(data => data[0])
  },
  getMessagesInCollection (userId, offset = 0, limit = 20) {
    const sql = `select * from message_table where user_id=${userId} order offset ${offset} limit ${limit} offset  by create_time desc;`
    return sqlQuery(sql).then(data => data[0])
  },
  getMessagesInCollectionTotal (userId) {
    const sql = `select * from message_table where user_id=${userId};`
    return sqlQuery(sql).then(data => data[0])
  },
  addMessage ({message, userId}) {
    const sql = `insert into message_table (message, user_id) values (${message}, ${userId});`
    return sqlQuery(sql).then(data => data[0]).then(data => data[0])
  },
  delMessage (messageId) {
    const sql = `delete from message_table where message_id = ${messageId};`
    return sqlQuery(sql).then(data => data[0])
  }
}
