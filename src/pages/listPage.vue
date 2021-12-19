<template>
  <div class="list-container">
    <div class="list-list">
      <div class="list-item" v-for="item in messageList" :key="item.id">
        <div class="list-item-message-container">
          <div class="list-item-message">{{item.message}}</div>
          <div class="list-item-action-group">
            <i class="el-icon-edit" @click="onCommend(item)"></i>
            <i class="el-icon-star-off" @click="onCollect(item)"></i>
          </div>
        </div>

        <div v-if="commendIndex===item.id">
          <el-input
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          v-model="commend">
        </el-input>
        <el-button type="primary" size="mini" style="margin-top:5px;">发表</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Test',
  data () {
    return {
      // {message: 123, isShowCommend:true,commendList: [], commend: ''},
      messageList: [],
      commendIndex: -1,
      listType: 'common' // 取值 common collect
    }
  },
  created () {
    axios
      .get('http://localhost:3001/test')
      .then((res) => {
        if (res.data && res.data.code === 0) {
          this.msg = res.data.data.message
        }
      })
      .catch((err) => {
        console.log(err)
      })
  },
  async mounted () {
    this.messageList = await this.getData()
  },
  methods: {
    async getData () {
      // todo
      const data = [
        {message: 123, id: 1},
        {message: 123, id: 2, isShowCommend: true, commendList: [], commend: ''},
        {message: 123, id: 3},
        {message: 123, id: 4}
      ]
      return data
    },
    onCommend (messageItem) {
      this.commendIndex = messageItem.id
      // todo
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
    height:100%;
    width:100%;
    margin-top: 50px;
    margin-bottom: 50px;
    justify-content: center;
  }
  .list-list {
    width: 80%;
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
