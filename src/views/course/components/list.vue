<template>
  <div class="course-list">
    <el-form
      :inline="true"
      ref="form"
      label-position="left"
      :model="filterParams">
      <el-form-item label="课程名称：" prop="courseName">
        <el-input v-model="filterParams.courseName" placeholder="课程名称"></el-input>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-select v-model="filterParams.status">
          <el-option label="全部" value=""></el-option>
          <el-option label="上架" value="1"></el-option>
          <el-option label="下架" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="isLoading"
          @click="handleFilter">查询
        </el-button>
        <el-button
          :disabled="isLoading"
          @click="handleReset">重置
        </el-button>
      </el-form-item>
      <el-form-item style="float: right;">
        <el-button
          type="primary"
          @click="$router.push({
            name: 'course-create'
          })">
          <i class="el-icon-plus"></i>
          添加课程
        </el-button>
      </el-form-item>
    </el-form>
    <el-card>
      <el-table
        :data="courses"
        v-loading="isLoading"
        style="width: 100%; margin-bottom: 20px">
        <el-table-column
          prop="id"
          label="ID"
          width="80"
          align="center">
        </el-table-column>
        <el-table-column
          prop="courseName"
          label="课程名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格"
          :formatter="formatter"
          align="center">
        </el-table-column>
        <el-table-column
          prop="sortNum"
          label="排序"
          align="center">
        </el-table-column>
        <el-table-column
          prop="status"
          label="上架状态"
          align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0"
              :disabled="scope.row.isStatusLoading"
              @change="onStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="操作"
          align="center">
          <template slot-scope="scope">
            <el-button
              @click="$router.push({
                name: 'course-edit',
                params: {
                  courseId: scope.row.id
                }
              })">编辑</el-button>
            <el-button
              @click="$router.push({
                name: 'course-section',
                params: {
                  courseId: scope.row.id,
                  courseName: scope.row.courseName
                }
              })">内容管理
              </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="filterParams.currentPage"
        :page-sizes="[10, 15, 20]"
        :page-size=filterParams.pageSize
        layout="total, sizes, prev, pager, next, jumper"
        :total=totalCount
        :disabled="isLoading">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getQueryCourses, changeState } from '@/service/course'

export default {
  name: 'CourseList',
  data () {
    return {
      filterParams: {
        currentPage: 1,
        pageSize: 10,
        courseName: '',
        status: ''
      },
      courses: [],
      totalCount: 0,
      isLoading: true
    }
  },
  created () {
    this.loadCourses()
  },
  methods: {
    async onStateChange (course) {
      course.isStatusLoading = true
      const { data } = await changeState({
        courseId: course.id,
        status: course.status
      })
      if (data.code === '000000') {
        this.$message.success(`${course.status === 1 ? '上架' : '下架'}成功`)
        course.isStatusLoading = false
      }
    },
    async loadCourses () {
      this.isLoading = true
      const { data } = await getQueryCourses(this.filterParams)
      if (data.code === '000000') {
        data.data.records.forEach(item => {
          item.isStatusLoading = false
        })
        this.courses = data.data.records
        this.totalCount = data.data.total
        this.isLoading = false
      }
    },
    handleSizeChange (val) {
      this.filterParams.pageSize = val
      this.filterParams.currentPage = 1
      this.loadCourses()
    },
    handleCurrentChange (val) {
      this.filterParams.currentPage = val
      this.loadCourses()
    },
    handleFilter () {
      this.filterParams.currentPage = 1
      this.loadCourses()
    },
    handleReset () {
      this.$refs.form.resetFields()
      this.filterParams.currentPage = 1
      this.loadCourses()
    },
    formatter (row) {
      return `￥${row.price}`
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
