<template>
  <el-container>
    <el-aside width="200px">
      <!-- 侧边栏组件 -->
      <app-aside></app-aside>
    </el-aside>
    <el-container>
      <el-header>
        <app-header></app-header>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

import AppAside from '@/views/layout/components/AppAside'
import AppHeader from '@/views/layout/components/AppHeader'

export default {
  name: 'LayoutIndex',
  components: {
    AppAside,
    AppHeader
  }
}
</script>

<style lang="scss" scoped>
  .el-container{
    height: 100vh;
    min-width: 980px;
  }

  .el-aside{
    background-color: #ddd;
  }

  .el-header{
    background-color: #fff;
  }
</style>
