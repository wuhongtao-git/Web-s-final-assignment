const {sqlQuery} = require('./sql.js')
module.exports = {
  getCollects (userId, offset = 0, limit = 20) {
    const sql = `select * from collect_table where user_id=${userId} order offset ${offset} limit ${limit} offset  by create_time desc;`
    return sqlQuery(sql).then(data => data[0])
  },
  getCollectsTotal (userId) {
    const sql = `select count(*) from collect_table  where user_id=${userId};`
    return sqlQuery(sql).then(data => data[0])
  },
  addCollect ({messageId, userId}) {
    const sql = `insert into collect_table (message_id, user_id) values (${messageId}, ${userId});`
    return sqlQuery(sql).then(data => data[0]).then(data => data[0])
  },
  delCollect (collectId) {
    const sql = `delete from collect_table where collect_id = ${collectId};`
    return sqlQuery(sql).then(data => data[0])
  }
}
