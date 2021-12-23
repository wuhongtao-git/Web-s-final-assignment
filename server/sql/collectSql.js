const {sqlQuery} = require('./sql.js')
module.exports = {
  getCollects (userId, offset = 0, limit = 20) {
    const sql = `select * from collect_table where user_id=${userId} order by create_time desc limit ${limit} offset ${offset};`
    return sqlQuery(sql).then(data => data)
  },
  getCollectsTotal (userId) {
    const sql = `select count(*) as count from collect_table  where user_id=${userId};`
    return sqlQuery(sql).then(data => data && data[0])
  },
  addCollect ({messageId, userId}) {
    const sql = `insert into collect_table (message_id, user_id) values (${messageId}, ${userId});`
    return sqlQuery(sql).then(data => data)
  },
  delCollect ({collectId, userId}) {
    const sql = `delete from collect_table where collect_id = ${collectId} and user_id=${userId};`
    return sqlQuery(sql).then(data => data)
  }
}
