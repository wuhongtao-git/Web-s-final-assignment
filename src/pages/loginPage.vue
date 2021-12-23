<template>
  <div class="login-container">
    <div class="login-inner-container">
        <el-form :label-position="labelPosition" label-width="80px" :model="formLabelAlign">
          <el-form-item label="账号">
            <el-input v-model="name" clearable></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="password" show-password ></el-input>
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
import config from '@/config.js'
axios.defaults.withCredentials = true
export default {
  name: 'loginPage',
  data () {
    return {
      name: '',
      password: ''
    }
  },
  created () {
    //
  },
  methods: {
    register () {
      axios.get(`http://${config.serverPath}/user/register?userName=${this.name}&password=${this.password}`).then((res) => {
        this.$router.push('/list')
      })
        .catch((err) => {
          console.log(err)
        })
      this.$router.push('/list')
    },
    login () {
      axios.get(`http://${config.serverPath}/user/login?userName=${this.name}&password=${this.password}`).then((res) => {
        this.$router.push('/list')
      })
        .catch((err) => {
          console.log(err)
        })
      this.$router.push('/list')
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
