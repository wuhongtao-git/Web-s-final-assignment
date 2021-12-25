<template>
  <div class="list-container">
    <div class="list-inner-container">
      <div class="user-container">
        <el-dropdown @command="onMenuClick">
          <div class="user-photo">
            <i class="el-icon-s-custom"></i>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item  command="goList">首页</el-dropdown-item>
            <el-dropdown-item command="goMyCollect">我的收藏</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <div class="user-name">{{userInfo.user_name|| "未知"}}</div>

      </div>
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
          <el-button @click="onComment" type="primary" size="mini" style="margin-top:5px;">发表</el-button>
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
      listType: this.$route.query && this.$route.query.listType || 'common', // 取值 common collect
      pageSize: 5,
      total: 0,
      currPageIndex: 0,
      commentMessage: '',
      commentList: [],
      userInfo: {}
    }
  },
  created () {},
  async mounted () {
    await this.getUserData()
    this.getMessageData()
  },
  computed: {
    currMessageList () {
      let list = []
      console.log(this.pageSize * this.currPageIndex, this.pageSize * (this.currPageIndex + 1))
      list = this.messageList.slice(this.pageSize * this.currPageIndex, this.pageSize * (this.currPageIndex + 1))
      return list
    }
  },
  watch: {
    currPageIndex () {
      this.getMessageData()
    }
  },
  methods: {
    getMessageData () {
      const offset = this.pageSize * this.currPageIndex
      let url = `http://${config.serverPath}/message/get?offset=${offset}&limit=${this.pageSize}`
      if (this.listType === 'collect') {
        url = `http://${config.serverPath}/collect/get?offset=${offset}&limit=${this.pageSize}`
      }
      axios.get(url).then((data) => {
        data = data.data
        if (data && data.code === 0) {
          const list = data.data.list || []
          if (this.messageList.length < offset) {
            const count = offset - this.messageList.length
            console.log('######## this.messageList', offset, this.messageList.length)
            for (let i = 0; i < count; i++) {
              this.messageList.push({})
            }
            console.log('######## this.messageList', this.messageList.length)
          }
          this.messageList.splice(offset, this.pageSize, ...list)
          this.$set(this, 'messageList', this.messageList)
          console.log('######## this.messageList', this.messageList.length)
          this.total = data.data.total || 0
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
        }
      })
    },
    getUserData () {
      return axios.get(`http://${config.serverPath}/user/get`).then((data) => {
        data = data.data
        if (data && data.code === 0) {
          const userInfo = data.data.userData || {}
          this.$set(this, 'userInfo', userInfo)
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
        }
      })
    },

    onCollect (messageItem) {
      axios.get(`http://${config.serverPath}/collect/add?messageId=${messageItem.message_id}`).then((data) => {
        data = data.data
        if (data && data.code === 0) {
          this.getCommentData()
        }
      })
    },
    onMenuClick (command) {
      switch (command) {
        case 'goList': this.goList(); break
        case 'goMyCollect': this.goMyCollect(); break
        case 'logout': this.logout(); break
      }
    },
    goList () {
      this.$router.push('/list?listType=common')
    },
    goMyCollect () {
      this.$router.push('/collect?listType=collect')
    },
    logout () {
      console.log('####### logout')
      axios.get(`http://${config.serverPath}/user/logout`).then((data) => {
        data = data.data
        if (data && data.code === 0) {
          this.$router.push('/login')
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
    margin: 20px 0;
    padding: 5px 20px;
    border:1px solid rgba(0, 0, 0, 0.1);
    border-radius: 3px;
  }
  .list-item-message-container {
    position: relative;
  }
  .list-item-message {
    width: 80px;
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
    align-items: center;
    justify-content: left;
  }
</style>
