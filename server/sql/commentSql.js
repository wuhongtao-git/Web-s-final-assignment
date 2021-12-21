const {sqlQuery} = require('./sql.js')
module.exports = {
  getComments (messageId, offset = 0, limit = 20) {
    const sql = `select * from comment_table where message_id=${messageId} order offset ${offset} limit ${limit} offset  by create_time desc;`
    return sqlQuery(sql).then(data => data[0])
  },
  getCommentsTotal (messageId) {
    const sql = `select * from comment_table where message_id=${messageId};`
    return sqlQuery(sql).then(data => data[0])
  },
  addComment ({commentMessage, messageId, userId}) {
    const sql = `insert into comment_table (comment_message, message_id, user_id) values (${commentMessage}, ${messageId}, ${userId});`
    return sqlQuery(sql).then(data => data[0]).then(data => data[0])
  },
  delComment (commentId) {
    const sql = `delete from comment_table where comment_id = ${commentId};`
    return sqlQuery(sql).then(data => data[0])
  }
}
