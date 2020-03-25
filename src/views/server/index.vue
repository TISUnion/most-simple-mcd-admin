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
      @sort-change="sortChange"
    >
      <el-table-column v-if="showId" align="center" label="id" width="120">
        <template slot-scope="{row}">
          <span>{{ row.id | ellipsis }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showName" align="center" label="名称" width="150">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showName" align="center" label="端口" width="150">
        <template slot-scope="{row}">
          <span>{{ row.port }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showName" align="center" label="运行工作路径" width="150">
        <template slot-scope="{row}">
          <span>{{ row.run_rath | ellipsis }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showName" align="center" label="是否是镜像服务器" width="150">
        <template slot-scope="{row}">
          <span>{{ row.is_mirror }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showName" align="center" label="使用内存大小" width="160">
        <template slot-scope="{row}">
          <span>{{ row.memory }}M</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showName" align="center" label="服务端版本" width="150">
        <template slot-scope="{row}">
          <span>{{ row.version }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showName" align="center" label="游戏模式" width="150">
        <template slot-scope="{row}">
          <span>{{ row.game_type }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="showName" align="center" label="当前状态" width="150">
        <template slot-scope="{row}">
          <el-tag :type="row.state | statusFilter">
            <span>{{ row.state |getStateStr }}</span>
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="showName" align="center" label="操作">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button v-if="row.status!='draft'" type="success" size="mini" @click="handleServer(row,'start')">
            开启
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleServer(row, 'stop')">
            停止
          </el-button>
          <el-button v-if="row.status!='published'" type="warning" size="mini" @click="handleServer(row,'restart')">
            重启
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/server'
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
  },
  methods: {
    async getList() {
      await getList().then(Response => {
        const items = Response.data
        this.list = items
      })
      this.listLoading = false
    }
  },
  handleServer(row, method) {
    switch (method) {
      case 'start' :
        break
      case 'stop' :
        break
      case 'restart' :
        break
    }
  }
}
</script>
