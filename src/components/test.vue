<template>
  <div>
    <div>测试数据请求，前端服务请求后端服务数据</div>
    <h1>{{ this.msg }}</h1>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Test',
  data () {
    return {
      msg: ''
    }
  },
  created () {
    axios
      .get('http://localhost:3000/test')
      .then((res) => {
        if (res.data && res.data.code === 0) {
          this.msg = res.data.data.message
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
}
</script>
