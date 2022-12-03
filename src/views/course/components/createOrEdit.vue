<template>
  <div class="course-create-or-edit">
    <el-card>
      <div slot="header">
        <el-steps :active="activeStep" simple>
          <el-step
          v-for="(item, index) in steps" :key="item.id"
          :title="item.title"
          :icon="item.icon"
          @click.native="activeStep = index">
        </el-step>
      </el-steps>
      </div>
      <el-form label-width="80px" :rules="rules" :model="course">
        <div v-show="activeStep === 0">
          <el-form-item label="课程名称" prop="courseName">
            <el-input v-model="course.courseName">
              <template slot="append">{{course.courseName.length}}/50</template>
            </el-input>
          </el-form-item>
          <el-form-item label="课程简介" prop="brief">
            <el-input v-model="course.brief">
              <template slot="append">{{course.brief.length}}/100</template>
            </el-input>
          </el-form-item>
          <el-form-item label="课程概述" prop="previewFirstField">
            <el-input
            style="width:49%;min-width: 300px;margin-right: 15px;"
            v-model="course.previewFirstField"
            placeholder="概述1">
            <template slot="append">{{course.previewFirstField.length}}/20</template>
          </el-input>
            <el-input
            style="width:49%;min-width: 300px;"
            v-model="course.previewSecondField"
            placeholder="概述2">
            <template slot="append">{{course.previewFirstField.length}}/20</template>
          </el-input>
          </el-form-item>
          <el-form-item label="讲师姓名">
            <el-input v-model="course.teacherDTO.teacherName">
              <template slot="append">{{course.teacherDTO.teacherName.length}}/50</template>
            </el-input>
          </el-form-item>
          <el-form-item label="讲师简介">
            <el-input v-model="course.teacherDTO.description">
              <template slot="append">{{course.teacherDTO.description.length}}/100</template>
            </el-input>
          </el-form-item>
          <el-form-item label="课程排序">
            <el-input-number
            label="描述文字"
            controls-position="right"
            v-model="course.sortNum">
          </el-input-number>
          </el-form-item>
        </div>
        <div v-show="activeStep === 1">
          <course-image
          v-model="course.courseListImg"
          label="课程封面"
          :limit="3">
        </course-image>
          <course-image
          v-model="course.courseImgUrl"
          label="解锁封面">
        </course-image>
        </div>
        <div v-show="activeStep === 2">
          <el-form-item label="售卖价格" prop="discounts">
            <el-input
            v-model="course.discounts"
            type="number"
            :min="0">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品原价">
            <el-input
            v-model="course.price"
            type="number"
            :min="0">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量">
            <el-input
            type="number"
            :min="0"
            v-model="course.sales">
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签">
            <el-input v-model="course.discountsTag"></el-input>
          </el-form-item>
        </div>
        <div v-show="activeStep === 3">
          <el-form-item label="限时秒杀">
            <el-switch
            v-model="course.activityCourse"
            active-color="#13ce66"
            inactive-color="#ff4949">
            </el-switch>
          </el-form-item>
          <template v-if="course.activityCourse">
            <el-form-item label="开始时间">
              <el-date-picker
                v-model="course.activityCourseDTO.beginTime"
                type="datetime"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker
                v-model="course.activityCourseDTO.endTime"
                type="datetime"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="秒杀价">
              <el-input
              type="number"
              :min="0"
              v-model="course.activityCourseDTO.amount">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="库存">
              <el-input
              type="number"
              :min="0"
              v-model="course.activityCourseDTO.stock">
                <template slot="append">个</template>
              </el-input>
            </el-form-item>
          </template>
        </div>
        <div v-show="activeStep === 4">
          <el-form-item label="课程详情">
            <text-editor v-model="course.courseDescriptionMarkDown"></text-editor>
          </el-form-item>
          <el-form-item label="是否上架">
            <el-switch
              v-model="course.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0">
            </el-switch>
          </el-form-item>
        </div>
        <el-form-item v-if="activeStep !== steps.length-1">
          <el-button @click="activeStep++">下一步</el-button>
        </el-form-item>
        <el-form-item v-if="activeStep === steps.length-1">
          <el-button
          type="primary"
          @click="handleSave">
          保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { saveOrUpdateCourse, getCourseById } from '@/service/course'
import CourseImage from './courseImage.vue'
import TextEditor from '@/components/textEditor/index.vue'

export default {
  name: 'CourseCreateOrEdit',
  components: {
    CourseImage,
    TextEditor
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    courseId: {
      type: [Number, String]
    }
  },
  data () {
    return {
      activeStep: 0,
      steps: [
        { id: 1, title: '基本信息', icon: 'el-icon-edit' },
        { id: 2, title: '课程封面', icon: 'el-icon-picture' },
        { id: 3, title: '销售信息', icon: 'el-icon-goods' },
        { id: 4, title: '秒杀信息', icon: 'el-icon-bell' },
        { id: 5, title: '课程详情', icon: 'el-icon-s-comment' }
      ],
      imageUrl: '',
      course: {
        id: null,
        courseName: '',
        brief: '',
        teacherDTO: {
          id: null,
          courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        courseDescriptionMarkDown: '',
        price: 0,
        discounts: 0,
        priceTag: '',
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        courseListImg: '',
        courseImgUrl: '',
        sortNum: 0,
        previewFirstField: '',
        previewSecondField: '',
        status: 0,
        sales: 0,
        activityCourse: false,
        activityCourseDTO: {
          id: null,
          courseId: 0,
          beginTime: '',
          endTime: '',
          amount: 0,
          stock: 0
        },
        autoOnlineTime: ''
      },
      rules: {
        courseName: [
          { required: true, message: '请输入课程名称', trigger: 'blur' },
          { min: 3, max: 50, message: '长度在 3 到 50 个字符', trigger: 'blur' }
        ],
        brief: [
          { required: true, message: '请输入课程简介', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ],
        previewFirstField: [
          { required: true, message: '请输入课程概述', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        discounts: [
          { required: true, message: '请输入课程价格', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    if (this.isEdit) {
      this.loadCourse()
    }
  },
  methods: {
    async handleSave () {
      const { data } = await saveOrUpdateCourse(this.course)
      if (data.code === '000000') {
        this.$message.success(`${this.isEdit ? '编辑' : '添加'}课程成功！`)
        this.$router.push({ name: 'course' })
      }
    },
    async loadCourse () {
      const { data } = await getCourseById(this.courseId)
      if (data.code === '000000') {
        console.log(data)
        if (!data.data.activityCourse) {
          data.data.activityCourseDTO = {
            id: null,
            courseId: 0,
            beginTime: '',
            endTime: '',
            amount: 0,
            stock: 0
          }
        }
        this.course = data.data
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-step {
    cursor: pointer;
  }
</style>
