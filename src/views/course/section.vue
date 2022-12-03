<template>
  <div class="course-section">
    <div class="header">
      <el-page-header @back="goBack" :content="courseName"></el-page-header>
      <el-button type="primary" @click="handleAddSection">
        <i class="el-icon-plus"></i>
          添加阶段
      </el-button>
    </div>
    <el-card>
      <el-tree
        v-loading="isLoading"
        :data="sections"
        :props="defaultProps"
        draggable
        :allow-drop="handleDrop"
        @node-drop="handleNode">
        <div class="inner" slot-scope="{ node, data}">
          <span>{{ node.label }}</span>
          <span v-if="data.sectionName" class="actions">
            <el-button size="mini" @click="handleEditSection(data)">编辑</el-button>
            <el-button size="mini" type="primary" @click="handleAddLesson(data)">添加课时</el-button>
            <el-button size="mini" @click="handleSectionStatus(data)">
              {{data.status === 0 ? '已隐藏' : data.status === 1 ? '待更新' : '已更新'}}</el-button>
          </span>
          <span v-else class="actions">
              <el-button size="mini" @click="handleEditLesson(data)">编辑</el-button>
              <el-button size="mini"
              type="success"
              @click="$router.push({
                name: 'course-video',
                params: {
                  courseId,
                  lessonId: data.id
                },
                query: {
                  theme: data.theme,
                  duration: data.duration
                }
                })">
              上传视频</el-button>
              <el-button size="mini" @click="handleLessonStatus(data)">
                {{data.status === 0 ? '已隐藏' : data.status === 1 ? '待更新' : '已更新'}}</el-button>
          </span>
        </div>
      </el-tree>
    </el-card>
    <el-dialog
    :title="isSectionEdit ? '章节信息' : '添加章节'"
    :visible.sync="sectionDialog"
    :before-close="closeSectionHandler"
    width="500px">
      <el-form :model="sectionForm" ref="sectionForm" :rules="sectionRules" label-position="right" label-width="80px">
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="sectionForm.courseName" clearable disabled></el-input>
        </el-form-item>
        <el-form-item label="章节名称" prop="sectionName">
          <el-input v-model="sectionForm.sectionName" clearable></el-input>
        </el-form-item>
        <el-form-item label="章节描述" prop="description">
          <el-input v-model="sectionForm.description" clearable type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="章节排序" prop="orderNum">
          <el-input v-model="sectionForm.orderNum" type="number">
            <template slot="append">数字控制排序，数字越大越靠后</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeSectionHandler">取 消</el-button>
        <el-button type="primary" @click="onSubmitSection">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
    :title="isLessonEdit ? '课时基本信息' : '添加课时'"
    :visible.sync="lessonDialog"
    :before-close="closeLessonHandler"
    width="500px">
      <el-form :model="lessonForm" ref="lessonForm" :rules="lessonRules" label-position="right" label-width="80px">
        <el-form-item label="课程名称" prop="courseName">
          <el-input v-model="lessonForm.courseName" clearable disabled></el-input>
        </el-form-item>
        <el-form-item label="章节名称" prop="sectionName">
          <el-input v-model="lessonForm.sectionName" clearable disabled></el-input>
        </el-form-item>
        <el-form-item label="课时名称" prop="theme">
          <el-input v-model="lessonForm.theme" clearable></el-input>
        </el-form-item>
        <el-form-item label="时长" prop="duration">
          <el-input v-model="lessonForm.duration" type="number">
            <template slot="append">分钟</template>
          </el-input>
        </el-form-item>
        <el-form-item label="是否开放试听" prop="isFree" label-width="80">
            <el-switch
              v-model="lessonForm.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              :active-value="1"
              :inactive-value="0">
            </el-switch>
        </el-form-item>
        <el-form-item label="课时排序" prop="orderNum">
          <el-input v-model="lessonForm.orderNum" type="number">
            <template slot="append">数字控制排序，数字越大越靠后</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeLessonHandler">取 消</el-button>
        <el-button type="primary" @click="onSubmitLesson">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog  v-if="isLessonStatus" title="提示" :visible.sync="statusDialog" width="500px">
      <div class="status">
        <i class="el-icon-info"></i>
        <span>当前状态为：{{lessonForm.status === 0 ? '已隐藏' : lessonForm.status === 1 ? '待更新' : '已更新'}}</span>
      </div>
      <el-form :model="lessonForm" ref="lessonForm" label-position="right" label-width="100px">
        <el-form-item label="提示" prop="status">
          <el-select placeholder="请选择" v-model="lessonForm.status" @change="changeLessonStatus">
            <el-option label="已隐藏" :value="0"></el-option>
            <el-option label="待更新" :value="1"></el-option>
            <el-option label="已更新" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="statusDialog = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitStatus">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog  v-else title="提示" :visible.sync="statusDialog" width="500px">
      <div class="status">
        <i class="el-icon-info"></i>
        <span>当前状态为：{{lessonForm.status === 0 ? '已隐藏' : lessonForm.status === 1 ? '待更新' : '已更新'}}</span>
      </div>
      <el-form :model="sectionForm" ref="sectionForm" label-position="right" label-width="100px">
        <el-form-item label="提示" prop="status">
          <el-select placeholder="请选择" v-model="sectionForm.status" @change="changeLessonStatus">
            <el-option label="已隐藏" :value="0"></el-option>
            <el-option label="待更新" :value="1"></el-option>
            <el-option label="已更新" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="statusDialog = false">取 消</el-button>
        <el-button type="primary" @click="onSubmitStatus">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSectionAndLesson, saveOrUpdateSection, saveOrUpdateLesson } from '@/service/course'

export default {
  name: 'CourseSection',
  props: {
    courseId: {
      type: [Number, String],
      require: true
    },
    courseName: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      sections: [],
      defaultProps: {
        children: 'lessonDTOS',
        label (data) {
          // data 章节和课时的节点名不同检测后分别使用
          return data.sectionName || data.theme
        }
      },
      isLoading: false,
      sectionDialog: false,
      lessonDialog: false,
      statusDialog: false,
      isSectionEdit: false,
      isLessonEdit: false,
      isLessonStatus: false,
      sectionForm: {
        id: null,
        courseId: this.courseId,
        courseName: this.courseName,
        sectionName: '',
        description: '',
        orderNum: 0,
        status: 0
      },
      lessonForm: {
        courseName: this.courseName,
        sectionName: '',
        id: null,
        courseId: 0,
        sectionId: 0,
        theme: '',
        duration: 0,
        isFree: true,
        orderNum: 0,
        status: 0
      },
      sectionRules: {
        courseName: [
          { required: true }
        ],
        sectionName: [
          { required: true, message: '请输入章节名称', trigger: 'blur' },
          { min: 3, max: 40, message: '长度在 3 到 40 个字符', trigger: 'blur' }
        ]
      },
      lessonRules: {
        courseName: [
          { required: true }
        ],
        sectionName: [
          { required: true }
        ],
        theme: [
          { required: true, message: '请输入课时名称', trigger: 'blur' },
          { min: 3, max: 100, message: '长度在 3 到 100 个字符', trigger: 'blur' }
        ],
        duration: [
          { required: true },
          { min: 0, message: '请输入正确时长', trigger: 'blur' }
        ],
        isFree: [
          { required: true }
        ]
      }
    }
  },
  created () {
    this.loadSectionAndLesson()
  },
  methods: {
    async loadSectionAndLesson () {
      const { data } = await getSectionAndLesson(this.courseId)
      if (data.code === '000000') {
        this.sections = data.data
      }
    },
    handleDrop (draggingNode, dropNode, type) {
      return type !== 'inner' && draggingNode.data.sectionId === dropNode.data.sectionId
    },
    async handleNode (draggingNode, dropNode, type, event) {
      this.isLoading = true
      try {
        await Promise.all(dropNode.parent.childNodes.map((item, index) => {
          if (draggingNode.data.sectionId) {
            return saveOrUpdateLesson({
              id: item.data.id,
              orderNum: index
            })
          } else {
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index
            })
          }
        }))
        this.$message.success('数据更新成功！')
      } catch (err) {
        this.$message.error('数据更新失败！', err)
      }
      this.isLoading = false
    },
    goBack () {
      this.$router.push({ name: 'course' })
    },
    async onSubmitSection () {
      const { data } = await saveOrUpdateSection(this.sectionForm)
      console.log(data)
      if (data.code === '000000') {
        this.loadSectionAndLesson()
        this.sectionDialog = false
        this.$refs.sectionForm.resetFields()
        this.$message.success(`${this.isSectionEdit ? '编辑章节成功！' : '添加章节成功！'}`)
      }
    },
    handleAddSection () {
      this.isSectionEdit = false
      this.sectionDialog = true
    },
    handleEditSection (row) {
      this.isSectionEdit = true
      this.sectionDialog = true
      this.sectionForm.sectionName = row.sectionName
      this.sectionForm.description = row.description
      this.sectionForm.orderNum = row.orderNum
      this.sectionForm.id = row.id
    },
    closeSectionHandler () {
      this.sectionDialog = false
      this.$refs.sectionForm.resetFields()
    },
    closeLessonHandler () {
      this.lessonDialog = false
      this.$refs.lessonForm.resetFields()
    },
    handleAddLesson (row) {
      this.lessonForm.sectionName = row.sectionName
      this.lessonForm.courseId = row.courseId
      this.lessonForm.sectionId = row.id
      this.isLessonEdit = false
      this.lessonDialog = true
    },
    handleEditLesson (row) {
      this.isLessonEdit = true
      this.lessonForm.id = row.id
      this.lessonForm.courseId = row.courseId
      this.lessonForm.sectionId = row.sectionId
      this.lessonForm.theme = row.theme
      this.lessonForm.duration = row.duration
      this.lessonForm.isFree = row.isFree
      this.lessonForm.orderNum = row.orderNum
      this.lessonForm.status = row.status
      this.lessonDialog = true
    },
    async onSubmitLesson () {
      const { data } = await saveOrUpdateLesson(this.lessonForm)
      if (data.code === '000000') {
        this.loadSectionAndLesson()
        this.closeLessonHandler()
        this.$message.success(`${this.isLessonEdit ? '编辑课时成功！' : '添加课时成功！'}`)
      }
    },
    handleLessonStatus (row) {
      this.isLessonStatus = true
      this.lessonForm = row
      this.statusDialog = true
    },
    handleSectionStatus (row) {
      console.log(row)
      this.isLessonStatus = false
      this.sectionForm.id = row.id
      this.sectionForm.courseId = row.courseId
      this.sectionForm.sectionName = row.sectionName
      this.sectionForm.description = row.description
      this.sectionForm.orderNum = row.orderNum
      this.sectionForm.status = row.status
      this.statusDialog = true
    },
    changeLessonStatus (value) {
      this.lessonForm.status = value
    },
    async onSubmitStatus () {
      if (!this.isLessonStatus) {
        const { data } = await saveOrUpdateSection(this.sectionForm)
        if (data.code === '000000') {
          this.statusDialog = false
          this.$message.success('章节状态更新成功！')
        }
      } else {
        const { data } = await saveOrUpdateLesson(this.lessonForm)
        if (data.code === '000000') {
          this.statusDialog = false
          this.$message.success('课时状态更新成功！')
        }
      }
      this.loadSectionAndLesson()
    }
  }
}
</script>

<style lang="scss" scoped>
  .header {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .inner {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
  ::v-deep .el-tree-node__content {
    height: auto;
  }
  .status {
    width: 100%;
    height: 100%;
    font-size: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    i {
      display: block;
      font-size: 50px;
      margin-bottom: 20px;
    }
  }
</style>
