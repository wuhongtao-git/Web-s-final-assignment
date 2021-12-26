#### 请先clone 代码到本地，命令 clone xxxx.git，最好是用ssh的方式[教程](https://www.jianshu.com/p/31cbbbc5f9fa)，[https 拉取方式改ssh](https://blog.csdn.net/yychuyu/article/details/80186783) 
#### 安装 执行 npm install，不行的话，直接找队友要一个 ./node_modules 吧
#### 启动mysql, 可参考下边【相关资料】【sql】
#### 启动服务，需要启动后端express 服务和 前端 vue 服务，命令分别是 npm run start:server ； npm run start:vue


#### 相关资料
1. 安装node 环境 [安装教程](https://www.runoob.com/nodejs/nodejs-install-setup.html)，安装 可以在命令行中看到，安装后，可以在命令行中看下 node -v 是否有输出，证明已经安装
2. 安装 git [安装教程](https://blog.csdn.net/Small_Yogurt/article/details/104966939)
3. 安装express  [安装express教程](https://expressjs.com/zh-cn/starter/installing.html)
3. 使用express搭建基本服务
4. 使用mysql 提供数据存储能力 [教程](https://expressjs.com/zh-cn/guide/database-integration.html#mysql) [教程](https://www.runoob.com/mysql/mysql-install.html)[数据库命令](https://www.jianshu.com/p/92d47d986a4e)
5. 使用express +vue 搭建基础服务 [教程](https://zhuanlan.zhihu.com/p/116749549)
6. vue 项目的创建  [教程](https://cli.vuejs.org/zh/guide/creating-a-project.html#vue-create)  如果无法使用， 可能是vue 安装的比较低，可以使用这个[教程](https://www.jianshu.com/p/02b12c600c7b)
7. 使用前端组件库  elemen UI [教程](https://element.eleme.io/#/zh-CN/component/installation)



#### sql
###### 启动和停止命令
```
// 请将mysql-dev 替换成自己的本地的service name
net start mysql-dev
net stop mysql-dev
```
###### sql 配置 
所有的配置，都收敛到config.default.js， sql相关的是
```
sqlHost: 'localhost',
sqlUser: 'root', // 如果不是root，请自行更换
sqlPassword: '121212mysql', // sqlUser 的密码
sqlDatabase: 'database_1', //  本项目使用的是这个，不要换
```

###### 创建表格和 插入一些测试数据，请先进入mysql 命令行工具
```
// 创建database 和 table，并执行下边的命令，请自行替换成自己本地路径
\. E:\www\Web-s-final-assignment\server\sql\createSql.sql
// 批量插入数据
\. E:\www\Web-s-final-assignment\server\sql\testDataSql.sql
```
### sql 的坑
1. sql 如果是最新版8.0 使用node链接 sql 会包错，可参考[文档](https://stackoverflow.com/questions/50093144/mysql-8-0-client-does-not-support-authentication-protocol-requested-by-server) 这个项目使用以下方法修复：
```
// 命令行进入  mysql
// 执行
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '121212mysql';
// 执行
flush privileges;

```

#### 跨域问题解决
1. 正常不会这么搞，为了快，先这么整吧   [教程](https://blog.csdn.net/zyj362633491/article/details/86540714)