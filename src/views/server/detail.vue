<template>
  <div v-loading="loading" class="app-container">
    <template>
      <el-row>
        <el-col :offset="1" :span="8">
          <div class="grid-content bg-purple-light detail-top">服务端id：
            <span>{{ id }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="1" :span="8">
          <div class="grid-content bg-purple-light">名称：
            <template v-if="edit">
              <el-input v-model="detail.name" class="edit-input" size="small" />
            </template>
            <span v-else>{{ detail.name }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="1" :span="8">
          <div class="grid-content bg-purple-light">端口：
            <template v-if="edit">
              <el-input v-model="detail.port" class="edit-input" size="small" />
            </template>
            <span v-else>{{ detail.port }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="1" :span="23">
          <div class="grid-content bg-purple-light">运行工作路径：
            <template v-if="edit">
              <el-input v-model="detail.run_rath" class="edit-input" size="small" />
            </template>
            <span v-else>{{ detail.run_rath }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="1" :span="8">
          <div class="grid-content bg-purple-light">是否是镜像服务器：
            <template v-if="edit">
              <el-input v-model="detail.is_mirror" class="edit-input" size="small" />
            </template>
            <span v-else>{{ detail.is_mirror ? '是' : '否' }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="1" :span="8">
          <div class="grid-content bg-purple-light">使用内存大小：
            <template v-if="edit">
              <el-input v-model="detail.memory" class="edit-input" size="small" />
            </template>
            <span v-else>{{ detail.memory }}M</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="1" :span="8">
          <div class="grid-content bg-purple-light">服务的版本：
            <template v-if="edit">
              <el-input v-model="detail.version" class="edit-input" size="small" />
            </template>
            <span v-else>{{ detail.version }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="1" :span="8">
          <div class="grid-content bg-purple-light">游戏模式：
            <template v-if="edit">
              <el-input v-model="detail.game_type" class="edit-input" size="small" />
            </template>
            <span v-else>{{ detail.game_type }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="1" :span="8">
          <div class="grid-content bg-purple-light">运行命令：
            <el-table ref="dragTable" :data="detail.cmd_str" row-key="id" border fit highlight-current-row style="width: 100%;margin-top:15px">
              <el-table-column align="center" label="ID">
                <template slot-scope="{row}">
                  <span>{{ row }}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="1" :span="8">
          <div class="grid-content bg-purple-light">当前运行状态：
            <template v-if="edit">
              <el-input v-model="detail.state" class="edit-input" size="small" />
            </template>
            <span v-else>{{ detail.state | getStateStr }}</span>
          </div>
        </el-col>
      </el-row>
    </template>
    <el-divider><i class="el-icon-s-operation" /></el-divider>
    <template>
      <span>实时命令交互</span>
      <el-button class="panel-title-btn" type="success" size="medium" @click="handlePanel">{{ panelSwitch | getPanelSwitch }}</el-button>
      <el-button class="panel-title-btn" type="warning" size="medium" @click="resetPanel">清空</el-button>
      <div ref="panel" class="interact-panel" />
      <el-input v-model="command" :disabled="!panelSwitch" placeholder="" class="edit-input" size="medium" @keyup.enter.native="runCommand" />
    </template>
  </div>
</template>

<script>
import { getServerDetail } from '@/api/server'

const Base64 = require('js-base64').Base64

const stateMap = {
  '0': '停止',
  '1': '运行中',
  '-1': '正在启动',
  '-2': '正在关闭'
}
export default {
  filters: {
    getStateStr(value) {
      return stateMap[value + '']
    },
    getPanelSwitch(value) {
      if (!value) {
        return '开启'
      } else {
        return '关闭'
      }
    }
  },
  data() {
    return {
      id: '',
      detail: {},
      edit: false,
      loading: true,
      command: '',
      panelSwitch: false,
      panelWebsocket: null
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getDetail()
  },
  destroyed() {
    if (this.panelSwitch) {
      this.panelWebsocket.close() // 离开路由之后断开websocket连接
    }
  },
  methods: {
    getDetail() {
      getServerDetail({ id: this.id }).then(Response => {
        const { server_info } = Response.data
        this.detail.name = server_info.name
        this.detail.cmd_str = server_info.cmd_str
        this.detail.port = server_info.port
        this.detail.run_rath = server_info.run_rath
        this.detail.is_mirror = server_info.is_mirror
        this.detail.memory = server_info.memory
        this.detail.game_type = server_info.game_type
        this.detail.version = server_info.version
        this.detail.state = server_info.state
        this.loading = false
      })
    },
    runCommand() {
      if (this.command !== '') {
        this.addMsgToPanel(this.command)
        const params = {
          command: this.command,
          type: 2
        }
        this.panelWebsocket.send(JSON.stringify(params))
        if (this.command === 'stop' || this.command === '/stop') {
          this.panelWebsocket.close()
          this.panelSwitch = false
        }
        this.command = ''
      }
    },
    handlePanel() {
      if (!this.panelSwitch) {
        this.startPanel()
      } else {
        this.stopPanel()
      }
    },
    startPanel() {
      if (typeof (WebSocket) === 'undefined') {
        this.$message({
          message: '您的浏览器不支持该功能',
          type: 'warning'
        })
      }
      if (this.detail.state !== 1) {
        this.$message({
          message: '服务端未启动',
          type: 'warning'
        })
        return
      }
      if (this.panelSwitch) {
        return
      }
      this.panelWebsocket = new WebSocket(process.env.VUE_APP_WEBSOCKET_PATH + '?id=' + this.id)
      this.panelWebsocket.onmessage = (e) => {
        const redata = JSON.parse(e.data)
        this.addMsgToPanel(Base64.decode(redata.origin_data))
      }
      this.panelWebsocket.onopen = () => {
        this.panelWebsocket.send(this.$store.state.user.token) // 发送校验token
        this.panelSwitch = true
        this.addMsgToPanel('连接成功！')
      }
      this.panelWebsocket.onerror = () => {
        this.panelSwitch = false
        this.addMsgToPanel('连接失败！')
      }
      this.panelWebsocket.onclose = () => {
        this.panelSwitch = false
        this.addMsgToPanel('连接已中断！')
      }
    },
    stopPanel() {
      if (!this.panelSwitch) {
        return
      }
      this.panelWebsocket.close()
      this.panelSwitch = false
    },
    addMsgToPanel(msg) {
      const newSpanContent = document.createElement('div')
      newSpanContent.appendChild(document.createTextNode(msg))
      this.$refs.panel.appendChild(newSpanContent)
      this.$refs.panel.scrollTop = this.$refs.panel.scrollHeight
    },
    resetPanel() {
      this.$refs.panel.innerHTML = ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-row {
      margin-bottom: 20px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  .el-col {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
    border-radius: 4px;
  }
  .detail-top{
    margin-top: 0.5vh;
  }
  .grid-content{
    font-size: 20px;
  }
  .interact-panel{
    width: 100%;
    height: 500px;
    background-color: black;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif;
    margin-top: 20px;
    font-size: 20px;
    border-radius: 5px;
    overflow-y: scroll;
    color: chartreuse;
  }
  .panel-title-btn{
    display: inline-block;
    margin: 0 10px;
    font-size: 15px;
  }
</style>
