<template>
  <div class="list-container">
    <div class="user-container">
        <el-dropdown @command="onMenuClick">
          <div class="user-photo">
            <i class="el-icon-s-custom"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item  command="goList">推荐列表</el-dropdown-item>
            <el-dropdown-item  command="goMyList">我的列表</el-dropdown-item>
            <el-dropdown-item command="goMyCollect">我的收藏</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="user-name">{{userInfo.user_name|| "未知"}}</div>

      </div>
    <div v-if="listType === 'mylist'" class="list-pub-message-container">
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入内容"
        v-model="message">
      </el-input>
      <el-button @click="onPublicMessage" type="primary" size="mini" style="margin-top:5px;">发表消息</el-button>
    </div>
    <div class="list-inner-container">
      <div class="list-list">
        <div class="list-item" v-for="item in currMessageList" :key="item.message_id">
          <div class="list-item-message-container">
            <div class="list-item-message">{{item.message}}</div>
            <div class="list-item-action-group">
              <i class="el-icon-edit" @click="onShowComment(item)"></i>
              <i class="el-icon-star-off" @click="onCollect(item)"></i>
            </div>
          </div>
          <template v-if="messageIdInComment===item.message_id">
            <div>
              <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="commentMessage">
            </el-input>
            <el-button @click="onComment" type="primary" size="mini" style="margin-top:5px;">发表评论</el-button>
            </div>
            <div class="list-list-comment">
              <div class="list-item-comment" v-for="item in commentList" :key="item.comment_id">
                <div class="list-item-comment">{{item.comment_message}}</div>
              </div>
            </div>
          </template>

        </div>
      </div>
      <el-pagination
        layout="prev, pager, next"
        :page-size="pageSize"
        :current-page="currPageIndex+1"
        :total="total"
        @current-change="changePage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import config from '@/config.js'
axios.defaults.withCredentials = true
export default {
  data () {
    return {
      // {message: 123, isShowCommend:true,commendList: [], commend: ''},
      messageList: [],
      messageIdInComment: -1,
      listType: 'list', // 取值 list collect mylist
      pageSize: 5,
      total: 0,
      currPageIndex: 0,
      currMessageList: [],
      commentMessage: '',
      message: '',
      commentList: [],
      userInfo: {}
    }
  },
  created () {},
  async mounted () {
    await this.getUserData()
    this.initData()
  },
  computed: {
  },
  watch: {
    currPageIndex () {
      this.getMessageData()
    },
    $route (to, from) {
      this.initData()
    }
  },
  methods: {
    initData () {
      console.log('######', this.$route)
      this.listType = this.$route.name === 'list' ? 'list' : this.$route.name === 'collect' ? 'collect' : this.$route.name === 'mylist' ? 'mylist' : 'list'
      this.messageList = []
      this.$set(this, 'messageList', [])
      this.$set(this, 'currMessageList', [])
      this.messageIdInComment = -1
      this.total = 0
      this.currPageIndex = 0
      this.commentMessage = ''
      this.$set(this, 'commentList', [])

      this.getMessageData()
    },
    getMessageData () {
      const offset = this.pageSize * this.currPageIndex
      let url = `http://${config.serverPath}/message/get?offset=${offset}&limit=${this.pageSize}`
      if (this.listType === 'collect') {
        url = `http://${config.serverPath}/collect/get?offset=${offset}&limit=${this.pageSize}`
      } else if (this.listType === 'mylist') {
        url = `http://${config.serverPath}/message/getMy?offset=${offset}&limit=${this.pageSize}`
      }
      axios.get(url).then((data) => {
        data = data.data
        if (data && data.code === 0) {
          const list = data.data.list || []
          const tempList = [...this.messageList]
          list.forEach((item, index) => {
            tempList[index + offset] = item
          })
          this.$set(this, 'messageList', tempList)
          console.log('######## this.messageList', this.messageList)
          this.total = data.data.total || 0

          // 计算当前页数据
          let currMessageList = []
          currMessageList = this.messageList.slice(this.pageSize * this.currPageIndex, this.pageSize * (this.currPageIndex + 1))
          this.$set(this, 'currMessageList', currMessageList)
        } else if (data.data.message) {
          this.$message(data.data.message)
        }
      })
    },
    getCommentData () {
      const offset = 0
      axios.get(`http://${config.serverPath}/comment/get?offset=${offset}&limit=100&messageId=${this.messageIdInComment}`).then((data) => {
        data = data.data
        if (data && data.code === 0) {
          const list = data.data.list || []
          this.$set(this, 'commentList', list)
        } else if (data.data.message) {
          this.$message(data.data.message)
        }
      })
    },
    getUserData () {
      return axios.get(`http://${config.serverPath}/user/get`).then((data) => {
        data = data.data
        if (data && data.code === 0) {
          const userInfo = data.data.userData || {}
          this.$set(this, 'userInfo', userInfo)
        } else if (data.data.message) {
          this.$message(data.data.message)
        }
      })
    },
    changePage (page) {
      console.log(page - 1)
      this.currPageIndex = page - 1
    },
    onShowComment (messageItem) {
      this.commentList = []
      this.commentMessage = ''
      if (this.messageIdInComment === messageItem.message_id) {
        this.messageIdInComment = -1
      } else {
        this.messageIdInComment = messageItem.message_id
        this.getCommentData()
      }
    },
    onComment () {
      axios.get(`http://${config.serverPath}/comment/add?commentMessage=${this.commentMessage}&messageId=${this.messageIdInComment}`).then((data) => {
        data = data.data
        if (data && data.code === 0) {
          this.getCommentData()
        } else if (data.data.message) {
          this.$message(data.data.message)
        }
      })
    },

    onCollect (messageItem) {
      axios.get(`http://${config.serverPath}/collect/add?messageId=${messageItem.message_id}`).then((data) => {
        data = data.data
        if (data && data.code === 0) {
          this.$message({
            message: '收藏成功',
            type: 'success'
          })
        } else if (data.data.message) {
          this.$message(data.data.message)
        }
      })
    },
    onMenuClick (command) {
      switch (command) {
        case 'goList': this.goList(); break
        case 'goMyList': this.goMyList(); break
        case 'goMyCollect': this.goMyCollect(); break
        case 'logout': this.logout(); break
      }
    },
    goList () {
      this.$router.push('/list')
    },
    goMyList () {
      this.$router.push('/mylist')
    },
    goMyCollect () {
      this.$router.push('/collect')
    },
    logout () {
      console.log('####### logout')
      axios.get(`http://${config.serverPath}/user/logout`).then((data) => {
        data = data.data
        if (data && data.code === 0) {
          this.$router.push('/login')
        } else if (data.data.message) {
          this.$message(data.data.message)
        }
      })
    },

    onPublicMessage () {
      axios.get(`http://${config.serverPath}/message/add?message=${this.message}`).then((data) => {
        data = data.data
        if (data && data.code === 0) {
          this.message = ''
          this.initData()
        } else if (data.data.message) {
          this.$message(data.data.message)
        }
      })
    }
  }
}
</script>
<style scoped>
.list-container {
    display: flex;
    flex-direction: column;
    height:100%;
    width:100%;
    margin-top: 50px;
    margin-bottom: 50px;
    align-items: center;
  }
  .list-inner-container {
    height:100%;
    width:80%;
  }
  .list-list {
    width: 100%;
    overflow-y: auto;
  }
  .list-item {
    position: relative;
    margin-bottom: 20px;
    padding: 5px 20px;
    border:1px solid rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
  .list-item-message-container {
    position: relative;
  }
  .list-item-message {
    width:calc(100% - 50px);
    max-height: 200px;
  }
  .list-item-action-group {
    position: absolute;
    right: 0;
    top: 0;
  }
  .user-photo {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 30px;
    width:30px;
    border-radius: 15px;
    border: 1px solid #999;
    background-color:#aaa;
    margin-right: 10px;
  }
  .user-container {
    display: flex;
    width: 80%;
    align-items: center;
    justify-content: left;
    margin-bottom: 20px;
  }
  .list-pub-message-container {
    width: 80%;
    margin-bottom: 20px;
  }
</style>
