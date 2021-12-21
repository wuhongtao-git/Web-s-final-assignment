const serverPort = 3000
const vuePort = 8000
const host = '127.0.0.1'
module.exports = {
    serverPort,
    vuePort,
    vueHost: host,
    serverPath: `localhost:${serverPort}`,
    sqlHost: 'localhost',
    sqlUser: 'root',
    sqlPassword: '121212mysql',
    sqlDatabase: 'database_1'
}