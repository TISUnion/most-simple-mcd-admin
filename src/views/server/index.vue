<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" class="filter-item" style="margin-left:15px;" size="small" @click="upFileFormVisible = true">上传服务端<i class="el-icon-upload el-icon--right" /></el-button>
      <el-checkbox v-model="showId" disabled class="filter-item" style="margin-left:15px;">
        id
      </el-checkbox>
      <el-checkbox v-model="showName" disabled class="filter-item" style="margin-left:15px;">
        名称
      </el-checkbox>
      <el-checkbox v-model="showPort" class="filter-item" style="margin-left:15px;">
        端口
      </el-checkbox>
      <el-checkbox v-model="showSide" class="filter-item" style="margin-left:15px;">
        服务端类型
      </el-checkbox>
      <el-checkbox v-model="showRunPath" class="filter-item" style="margin-left:15px;">
        运行工作路径
      </el-checkbox>
      <el-checkbox v-model="showIsMirror" class="filter-item" style="margin-left:15px;">
        是否是镜像服务器
      </el-checkbox>
      <el-checkbox v-model="showMemory" class="filter-item" style="margin-left:15px;">
        使用内存大小，单位M
      </el-checkbox>
      <el-checkbox v-model="showVersion" class="filter-item" style="margin-left:15px;">
        服务端版本
      </el-checkbox>
      <el-checkbox v-model="showModel" class="filter-item" style="margin-left:15px;">
        游戏模式
      </el-checkbox>
      <el-checkbox v-model="showComment" class="filter-item" style="margin-left:15px;">
        备注
      </el-checkbox>
      <el-checkbox v-model="showState" class="filter-item" style="margin-left:15px;">
        当前状态
      </el-checkbox>
    </div>
    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row>
      <el-table-column v-if="showId" align="center" label="id">
        <template slot-scope="{row}">
          <el-tooltip effect="dark" :content="row.id" placement="top-start">
            <span>{{ row.id | ellipsis }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column v-if="showName" align="center" label="名称">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showPort" align="center" label="端口">
        <template slot-scope="{row}">
          <span>{{ row.port }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showPort" align="center" label="服务端类型">
        <template slot-scope="{row}">
          <span>{{ row.side }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showRunPath" align="center" label="运行工作路径">
        <template slot-scope="{row}">
          <el-tooltip effect="dark" :content="row.run_rath" placement="top-start">
            <span>{{ row.run_rath | ellipsis }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column v-if="showIsMirror" align="center" label="是否是镜像服务器" width="150">
        <template slot-scope="{row}">
          <span>{{ row.is_mirror ? "是" : "否" }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showMemory" align="center" label="使用内存大小">
        <template slot-scope="{row}">
          <span>{{ row.memory }}M</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showMemory" align="center" label="服务器ip">
        <template slot-scope="{row}">
          <el-select v-model="selectIp" placeholder="请选择ip" @change="copySelectedIp(row)">
            <el-option
              v-for="(item, index) in row.ips"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column v-if="showVersion" align="center" label="服务端版本">
        <template slot-scope="{row}">
          <span>{{ row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showModel" align="center" label="游戏模式">
        <template slot-scope="{row}">
          <span>{{ row.game_type }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showComment" align="center" label="备注">
        <template slot-scope="{row}">
          <el-tooltip effect="dark" :content="row.comment" placement="top-start">
            <span>{{ row.comment | ellipsis }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column v-if="showState" align="center" label="当前状态">
        <template slot-scope="{row}">
          <el-tag :type="row.state | statusFilter">
            <span>{{ row.state | getStateStr }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="500">
        <template slot-scope="{row}">
          <el-button type="info" size="mini" @click="updateServerInfo(row)">
            编辑
          </el-button>
          <el-button v-if="row.state==0" size="mini" type="success" @click="handleServer(row,'start')">
            开启
          </el-button>
          <el-button v-if="row.state==1" size="mini" type="danger" @click="handleServer(row, 'stop')">
            停止
          </el-button>
          <el-button v-if="row.state==1" size="mini" type="warning" @click="handleServer(row,'restart')">
            重启
          </el-button>
          <router-link :to="row.id | getDetailPath">
            <el-button size="mini" type="primary">
              详情
            </el-button>
          </router-link>
          <el-button size="mini" type="success" @click="downloadLog(row)">
            下载日志
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="编辑服务端信息" :visible.sync="dialogFormVisible">
      <el-form label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="名称">
          <el-input v-model="rowServerInfo.name" size="small" class="filter-item" placeholder="服务端名称" />
        </el-form-item>
        <el-form-item label="端口">
          <el-input v-model="rowServerInfo.port" size="small" class="filter-item" placeholder="服务端端口" />
        </el-form-item>
        <el-form-item label="内存">
          <el-input v-model="rowServerInfo.memory" size="small" class="filter-item" placeholder="服务端使用内存" />
        </el-form-item>
        <el-form-item label="版本">
          <el-input v-model="rowServerInfo.version" size="small" class="filter-item" placeholder="服务端版本" />
        </el-form-item>
        <el-form-item label="端类型">
          <el-select v-model="rowServerInfo.side" filterable placeholder="请选择">
            <el-option
              v-for="item in sides"
              :key="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="游戏模式">
          <el-input v-model="rowServerInfo.game_type" size="small" class="filter-item" placeholder="服务端模式" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="rowServerInfo.comment" type="textarea" rows="2" placeholder="请输入备注" size="small" class="filter-item" />
        </el-form-item>
      </el-form>
      <el-divider><i class="el-icon-s-operation" />启动参数设置</el-divider>
      <el-form :model="paramsForm" label-width="100px">
        <el-form-item
          v-for="(param, index) in paramsForm.params"
          :key="index"
          label="参数"
        >
          <el-input v-model="param.value" style="width: 50%" />
          <el-button @click.prevent="removeParam(param)">删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="addParam">新增参数</el-button>
          <el-button @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="saveServerInfo">
          提交
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="上传服务端" :visible.sync="upFileFormVisible">
      <el-form label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="上传">
          <el-upload
            ref="upload"
            class="upload-demo"
            drag
            :limit="1"
            :auto-upload="false"
            accept="jar"
            action="url"
            :http-request="uploadFile"
          >
            <i class="el-icon-upload" />
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div slot="tip" class="el-upload__tip">只能上传jar文件</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="newServerInfo.name" size="small" class="filter-item" placeholder="服务端名称" />
        </el-form-item>
        <el-form-item label="端口">
          <el-input v-model="newServerInfo.port" size="small" class="filter-item" placeholder="服务端端口" />
        </el-form-item>
        <el-form-item label="内存">
          <el-input v-model="newServerInfo.memory" size="small" class="filter-item" placeholder="服务端使用内存" />
        </el-form-item>
        <el-form-item label="端类型">
          <el-select v-model="newServerInfo.side" filterable placeholder="请选择">
            <el-option
              v-for="item in sides"
              :key="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="newServerInfo.comment" type="textarea" rows="2" placeholder="请输入备注" size="small" class="filter-item" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="upFileFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="newServer">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getList, operateServer, pingServer, downloadLog, updateServerInfo, uploadServer, getAllServerSide } from '@/api/server'
const stateMap = {
  '0': '停止',
  '1': '运行中',
  '-1': '正在启动',
  '-2': '正在关闭'
}
const statusTagMap = {
  '1': 'success',
  '-1': 'warning',
  '0': 'danger',
  '-2': 'warning'
}
const methodMapStr = {
  start: '启动',
  stop: '停止',
  restart: '重启'
}
// 1. 启动  2. 停止  3.重启 4.未知
const methodStateMap = {
  start: 1,
  stop: 2,
  restart: 3,
  unknow: 4
}
export default {
  name: 'Server',
  filters: {
    ellipsis(value) {
      if (!value) return ''
      if (value.length > 8) {
        return value.slice(0, 8) + '...'
      }
      return value
    },
    getStateStr(value) {
      return stateMap[value + '']
    },
    statusFilter(value) {
      return statusTagMap[value + '']
    },
    getDetailPath(value) {
      return `/server/detail/${value}`
    }
  },
  data() {
    return {
      showId: true,
      showName: true,
      showPort: true,
      showRunPath: true,
      showIsMirror: true,
      showMemory: true,
      showVersion: true,
      showModel: true,
      showState: true,
      showSide: true,
      showComment: true,
      selectIp: '',
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      dialogFormVisible: false,
      upFileFormVisible: false,
      rowServerInfo: null,
      newServerInfo: {},
      paramsForm: { params: [] },
      mcFile: [],
      sides: []
    }
  },
  created() {
    this.getList()
    // rowServerInfo初始化
    this.rowServerInfo = {
      name: '',
      port: 0,
      memory: 0,
      version: '',
      game_type: '',
      state: 2
    }
  },
  methods: {
    async getList() {
      await getList().then(Response => {
        let items = Response.data.list
        // 如果是正在启动，就循环获取状态
        if (items) {
          items.map((v, k) => {
          // 后端
            if (v.state === undefined) {
              v.state = 0
            }
            if (v.state !== 0 && v.state !== 1) {
              this.loopGetRunResult(v, 'unknow')
            }
          })
        } else {
          items = []
        }
        this.list = items
      })

      await getAllServerSide().then(Response => {
        this.sides = Response.data.serverSides
      })
      this.listLoading = false
    },
    updateServerInfo(row) {
      this.dialogFormVisible = true
      this.rowServerInfo = row
      this.paramsForm.params = []
      row.cmd_str.map((v) => {
        this.paramsForm.params.push({ value: v })
      })
    },
    removeParam(param) {
      const index = this.paramsForm.params.indexOf(param)
      if (index !== -1) {
        this.paramsForm.params.splice(index, 1)
      }
    },
    addParam() {
      this.paramsForm.params.push({
        value: ''
      })
    },
    reset() {
      this.paramsForm.params = []
      this.rowServerInfo.cmd_str.map((v) => {
        this.paramsForm.params.push({ value: v })
      })
    },
    saveServerInfo() {
      const params = this.rowServerInfo
      const cmd_strs = []
      this.paramsForm.params.map((v) => {
        cmd_strs.push(v.value)
      })
      params['cmd_str'] = cmd_strs
      params.port = Number(params.port)
      params.memory = Number(params.memory)
      updateServerInfo(params).then(() => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.dialogFormVisible = false
      })
    },
    copySelectedIp(row) {
      this.$copyText(this.selectIp + ':' + row.port).then(() => {
        this.$message({
          message: '复制成功',
          type: 'success'
        })
      })
    },
    handleServer(row, method) {
      this.$confirm(`是否进行${methodMapStr[method]}操作?`, '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const methodState = methodStateMap[method]
        const params = {
          id: [row.id],
          operate_type: methodState
        }
        operateServer(params).then(() => {
          if (methodStateMap[method] === 1) {
            row.state = -1
          }
          if (methodStateMap[method] === 2) {
            row.state = -2
          }
          if (methodStateMap[method] === 3) {
            row.state = -2
          }
          this.loopGetRunResult(row, method)
          this.$message({
            message: '操作成功',
            type: 'success'
          })
        })
      })
    },
    loopGetRunResult(row, method) {
      const params = { id: row.id }
      var loopM = setInterval(() => {
        pingServer(params).then(Response => {
          let state = Response.data.state
          if (state === undefined) {
            state = 0
          }
          row.state = state
          // 0.未启动 1.启动  -1.正在启动 -2.正在关闭
          if (state === 1 && methodStateMap[method] === 1) {
            this.getList().then()
            clearInterval(loopM)
          }
          if (state === 0 && methodStateMap[method] === 2) {
            this.getList().then()
            clearInterval(loopM)
          }
          if (state === 1 && methodStateMap[method] === 3) {
            this.getList().then()
            clearInterval(loopM)
          }
          if (methodStateMap[method] === 4 && (state === 1 || state === 0)) {
            this.getList()
            clearInterval(loopM)
          }
        })
      }, 1000)
    },
    downloadLog(row) {
      const params = { id: row.id, type: 1 }
      downloadLog(params).then(res => {
        const downloadElement = document.createElement('a')
        const href = window.URL.createObjectURL(new Blob([res])) // 创建下载的链接
        downloadElement.href = href
        downloadElement.download = `${row.name}.zip` // 下载后文件名
        document.body.appendChild(downloadElement)
        downloadElement.click() // 点击下载
        document.body.removeChild(downloadElement) // 下载完成移除元素
        window.URL.revokeObjectURL(href) // 释放blob对象
      })
    },
    uploadFile(params) {
      this.mcFile = params
    },
    newServer() {
      this.upFileFormVisible = false
      this.$refs.upload.submit()
      const form = new FormData()
      form.append('file', this.mcFile.file)
      form.append('name', this.newServerInfo.name)
      form.append('port', this.newServerInfo.port)
      form.append('memory', this.newServerInfo.memory)
      form.append('side', this.newServerInfo.side)
      form.append('comment', this.newServerInfo.comment)
      uploadServer(form).then(() => {
        this.$message({
          message: '上传成功成功',
          type: 'success'
        })
        this.getList()
        this.$refs.upload.clearFiles()
        this.newServerInfo = {}
      })
    }
  }
}
</script>

<style scoped>
.el-button+.el-button{
  margin: 0;
}
</style>
