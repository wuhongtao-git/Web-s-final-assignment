<template>
  <div class="list-container">
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
        <template v-if="commentMessageId===item.message_id">
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
      :current-page="currPageIndex"
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
      commentMessageId: -1,
      listType: 'common', // 取值 common collect
      pageSize: 5,
      total: 0,
      currPageIndex: 0,
      commentMessage: '',
      commentList: []
    }
  },
  created () {},
  mounted () {
    this.getData()
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
      this.getData()
    }
  },
  methods: {
    getData () {
      const offset = this.pageSize * this.currPageIndex
      axios.get(`http://${config.serverPath}/message/get?offset=${offset}&limit=${this.pageSize}`).then((data) => {
        data = data.data
        if (data && data.code === 0) {
          const list = data.data.list || []
          this.messageList.splice(offset, this.pageSize, ...list)
          this.$set(this, 'messageList', this.messageList)
          this.total = data.data.total || 0
        }
      })
    },
    getCommentData () {
      const offset = 0
      axios.get(`http://${config.serverPath}/comment/get?offset=${offset}&limit=100&messageId=${this.commentMessageId}`).then((data) => {
        data = data.data
        if (data && data.code === 0) {
          const list = data.data.list || []
          this.$set(this, 'commentList', list)
        }
      })
    },
    changePage (page) {
      console.log(page - 1)
      this.currPageIndex = page - 1
    },
    onShowComment (messageItem) {
      this.commentMessageId = messageItem.message_id
      this.commentList = []
      this.getCommentData()
    },
    onComment (messageItem) {
      axios.get(`http://${config.serverPath}/comment/add?commentMessage=${this.commentMessage}&messageId=${this.commentMessageId}`).then((data) => {
        data = data.data
        if (data && data.code === 0) {
          this.getCommentData
        }
      })
    },

    onCollect (messageItem) {
      // todo
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
</style>
