<template>
  <div class="login-container">
    <div class="login-inner-container">
        <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
          <el-form-item label="账号">
            <el-input v-model="name" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="passworld" show-password ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="register">注册</el-button>
            <el-button @click="login">登录</el-button>
            <el-button @click="touristLogin">游客</el-button>
        </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'loginPage',
  data () {
    return {
      name: '',
      passworld: ''
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
  },
  methods: {
    register () {
      this.$router.push('/list')
    },
    login () {

    },
    touristLogin () {

    }
  }
}
</script>
<style scoped>
  .login-container {
    display: flex;
    height:100%;
    width: 100%;
    align-items: center;
    justify-content: center;
  }
  .login-inner-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 500px;
    height:309px;
    border:1px solid #000;
    border-radius: 4px;
    background-color: antiquewhite;
  }
</style>
