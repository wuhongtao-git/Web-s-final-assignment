const {sqlQuery} = require('./sql.js')
module.exports = {
  getComments (messageId, offset = 0, limit = 20) {
    const sql = `select * from comment_table where message_id=${messageId} order by create_time desc limit ${limit} offset ${offset};`
    return sqlQuery(sql).then(data => data)
  },
  getCommentsTotal (messageId) {
    const sql = `select count(*) as count from comment_table where message_id=${messageId};`
    return sqlQuery(sql).then(data => data[0])
  },
  addComment ({commentMessage, messageId, userId}) {
    const sql = `insert into comment_table (comment_message, message_id, user_id) values ('${commentMessage}', ${messageId}, ${userId});`
    return sqlQuery(sql).then(data => data[0]).then(data => data)
  },
  delComment ({commentId, userId}) {
    const sql = `delete from comment_table where comment_id = ${commentId} and user_id=${userId};`
    return sqlQuery(sql).then(data => data)
  }
}
