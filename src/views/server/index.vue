<template>
  <div class="app-container">
    <div class="filter-container">
      <el-checkbox v-model="showId" disabled class="filter-item" style="margin-left:15px;">
        id
      </el-checkbox>
      <el-checkbox v-model="showName" disabled class="filter-item" style="margin-left:15px;">
        名称
      </el-checkbox>
      <el-checkbox v-model="showPort" class="filter-item" style="margin-left:15px;">
        端口
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
      <el-checkbox v-model="showState" class="filter-item" style="margin-left:15px;">
        当前状态
      </el-checkbox>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
    >
      <el-table-column v-if="showId" align="center" label="id">
        <template slot-scope="{row}">
          <span>{{ row.id | ellipsis }}</span>
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
      <el-table-column v-if="showRunPath" align="center" label="运行工作路径">
        <template slot-scope="{row}">
          <span>{{ row.run_rath | ellipsis }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showIsMirror" align="center" label="是否是镜像服务器" width="150">
        <template slot-scope="{row}">
          <span>{{ row.is_mirror }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showMemory" align="center" label="使用内存大小">
        <template slot-scope="{row}">
          <span>{{ row.memory }}M</span>
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
      <el-table-column v-if="showState" align="center" label="当前状态">
        <template slot-scope="{row}">
          <el-tag :type="row.state | statusFilter">
            <span>{{ row.state | getStateStr }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="500">
        <template slot-scope="{row}">
          <el-button type="info" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.state==0" type="success" size="mini" @click="handleServer(row,'start')">
            开启
          </el-button>
          <el-button v-if="row.state==1" size="mini" type="danger" @click="handleServer(row, 'stop')">
            停止
          </el-button>
          <el-button v-if="row.state==1" type="warning" size="mini" @click="handleServer(row,'restart')">
            重启
          </el-button>
          <router-link :to="row.id | getDetailPath">
            <el-button type="primary" size="mini">
              详情
            </el-button>
          </router-link>
          <el-button type="success" size="mini" @click="downloadLog(row)">
            下载日志
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList, operateServer, pingServer, downloadLog } from '@/api/server'
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
// 1. 启动  2. 停止  3.重启
const methodStateMap = {
  start: 1,
  stop: 2,
  restart: 3
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
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true
    }
  },
  created() {
    this.getList()
    console.log(this.$route)
  },
  methods: {
    async getList() {
      await getList().then(Response => {
        const items = Response.data
        this.list = items
      })
      this.listLoading = false
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
    handleUpdate(row) {
    },
    loopGetRunResult(row, method) {
      const params = { id: row.id }
      var loopM = setInterval(() => {
        pingServer(params).then(Response => {
          const { state } = Response.data
          row.state = state
          // 0.未启动 1.启动  -1.正在启动 -2.正在关闭
          if (state === 1 && methodStateMap[method] === 1) {
            clearInterval(loopM)
          }
          if (state === 0 && methodStateMap[method] === 2) {
            clearInterval(loopM)
          }
          if (state === 1 && methodStateMap[method] === 3) {
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
    }
  }
}
</script>
