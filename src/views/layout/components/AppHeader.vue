<template>
  <div class="app-header">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{ this.bread }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-dropdown>
    <span class="el-dropdown-link">
      <el-avatar :size="30" :src="userInfo.portrait || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"></el-avatar>
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item>{{ userInfo.userName }}</el-dropdown-item>
      <el-dropdown-item @click.native="handleLogout" divided>退出</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
  </div>
</template>

<script>
import { getUserInfo } from '@/service/user'

export default {
  name: 'AppHeader',
  data () {
    return {
      userInfo: {},
      bread: '课程管理'
    }
  },
  created () {
    this.loadUserInfo()
  },
  watch: {
    $route (val) {
      this.bread = val.meta.title
    }
  },
  methods: {
    async loadUserInfo () {
      const { data } = await getUserInfo()
      this.userInfo = data.content
    },
    handleLogout () {
      this.$confirm('确认退出？', '提示', {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.commit('setUser', null)
        this.$router.push('/login')
        this.$message({
          type: 'success',
          message: '退出成功！!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消退出！'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-header{
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .el-dropdown-link {
      display: flex;
      align-items: center;
    }
  }
</style>
