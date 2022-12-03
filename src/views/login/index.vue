<template>
  <div class="login">
    <h3>Edu Menagement</h3>
    <el-form ref="form" :model="form" :rules="rules" label-width="80px" label-position="top">
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone" autocomplete="true"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" autocomplete="true" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit" :loading="isLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/service/user'

export default {
  name: 'LoginIndex',
  data () {
    return {
      form: {
        phone: '18201288771',
        password: '111111'
      },
      rules: {
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'change' },
          { min: 6, max: 18, message: '密码长度为 6 到 18 位', trigger: 'blur' }
        ]
      },
      isLogin: false
    }
  },
  methods: {
    async onSubmit () {
      try {
        // 设置校验
        await this.$refs.form.validate()
        this.isLogin = true
        const { data } = await login(this.form)
        this.isLogin = false
        if (data.state === 1) {
          // 将用户信息存储在vuex中
          this.$store.commit('setUser', data.content)
          this.$message.success('登陆成功！')
          // 根据可能存在的 redirect 数据进行跳转
          this.$router.push(this.$route.query.redirect || '/')
        } else {
          this.$message.error('登陆失败！')
        }
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .login {
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    h3{
      font-size: 38px;
      color: $warning-color;
    }
  }
  .el-form{
    background-color: #fff;
    padding: 20px;
    width: 300px;
    border-radius: 10px;
    .el-button{
      width: 100%;
    }
  }
</style>
