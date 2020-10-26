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
          <div class="grid-content bg-purple-light">备注：
            <template v-if="edit">
              <el-input v-model="detail.comment" class="edit-input" size="small" />
            </template>
            <span v-else>{{ detail.comment }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <el-col :offset="1" :span="8">
          <div class="grid-content bg-purple-light">运行命令：
            <el-table ref="dragTable" :data="detail.cmd_str" row-key="id" border fit highlight-current-row style="width: 100%;margin-top:15px">
              <el-table-column align="center" label="命令参数">
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
          <div class="grid-content bg-purple-light">插件列表：
            <el-table ref="dragTable" :data="pluginsInfo" row-key="id" border fit highlight-current-row style="width: 100%;margin-top:15px">
              <el-table-column align="center" label="名称">
                <template slot-scope="{row}">
                  <span>{{ row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="命令">
                <template slot-scope="{row}">
                  <span>{{ row.command_name }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="是否被禁止">
                <template slot-scope="{row}">
                  <span>{{ row.is_ban ? "是" : "否" }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="说明">
                <template slot-scope="{row}">
                  <span>{{ row.description }}</span>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template slot-scope="{row}">
                  <el-button v-if="!row.is_ban" size="mini" type="danger" @click="handlePlugin(row, 2)"> 禁止 </el-button>
                  <el-button v-else size="mini" type="success" @click="handlePlugin(row, 1)"> 解禁 </el-button>
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
      <div ref="panel" class="interact-panel">
        <div v-for="(msg, index) in panelMessage" :key="index" v-html="msg" />
      </div>
      <el-input v-model="command" :disabled="!panelSwitch" placeholder="" class="edit-input" size="medium" @keyup.enter.native="runCommand" />
    </template>
  </div>
</template>

<script>
import { getServerDetail, operatePlugin, getConfigVal, pingServer } from '@/api/server'

const stateMap = {
  '0': '停止',
  '1': '运行中',
  '-1': '正在启动',
  '-2': '正在关闭'
}

// 1. 启动  2. 停止  3.重启 4.未知
const methodStateMap = {
  start: 1,
  stop: 2,
  restart: 3,
  unknow: 4
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
      panelWebsocket: null,
      pluginsInfo: [],
      panelMessage: [],
      wsHost: ''
    }
  },
  created() {
    this.id = this.$route.params.id
    this.getDetail()
    if (this.detail.state !== 0 && this.detail.state !== 1) {
      this.loopGetRunResult(this.detail, 'unknow')
    }
  },
  destroyed() {
    if (this.panelSwitch) {
      this.panelWebsocket.close() // 离开路由之后断开websocket连接
    }
  },
  methods: {
    async initParam() {
      await getConfigVal({ name: 'websocket_host' }).then(Response => {
        this.wsHost = Response.data.config_val
      })
    },
    async getDetail() {
      await getServerDetail({ id: this.id }).then(Response => {
        if (Response.data.state === undefined) {
          Response.data.state = 0
        }
        this.detail = Response.data
        this.pluginsInfo = Response.data.plugin_info
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
    async startPanel() {
      if (typeof (WebSocket) === 'undefined') {
        this.$message({
          message: '您的浏览器不支持该功能',
          type: 'warning'
        })
        return
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
      await this.initParam()
      const wsUrl = `ws://${this.wsHost}/most.simple.mcd.McServer/serverInteraction?id=${this.id}`
      this.panelWebsocket = new WebSocket(wsUrl)
      this.panelWebsocket.onmessage = (e) => {
        const redata = JSON.parse(e.data)
        this.addMsgToPanel(redata.origin_data)
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
      msg = msg.replace(/\\n/gm, '<br/>')
      this.panelMessage.push(msg)
      this.$nextTick(function() {
        this.$refs.panel.scrollTop = this.$refs.panel.scrollHeight
      })
    },
    resetPanel() {
      this.panelMessage = []
    },
    handlePlugin(row, operateType) {
      if (this.detail.state !== 1) {
        this.$message({
          message: '服务器未启动',
          type: 'error'
        })
        return
      }
      const operateTypeStr = { '1': '解禁', '2': '禁止' }
      operatePlugin({ server_id: this.id, plugin_id: [row.id], operate_type: operateType }).then(() => {
        this.$message({
          message: `${operateTypeStr[operateType]}插件${row.name}成功`,
          type: 'success'
        })
        this.getDetail()
      })
    },
    loopGetRunResult(row, method) {
      const params = { id: this.id }
      var loopM = setInterval(() => {
        pingServer(params).then(Response => {
          let state = Response.data.state
          if (state === undefined) {
            state = 0
          }
          row.state = state
          // 0.未启动 1.启动  -1.正在启动 -2.正在关闭
          if (state === 1 && methodStateMap[method] === 1) {
            this.getDetail().then()
            clearInterval(loopM)
          }
          if (state === 0 && methodStateMap[method] === 2) {
            this.getDetail().then()
            clearInterval(loopM)
          }
          if (state === 1 && methodStateMap[method] === 3) {
            this.getDetail().then()
            clearInterval(loopM)
          }
          if (methodStateMap[method] === 4 && (state === 1 || state === 0)) {
            this.getDetail()
            clearInterval(loopM)
          }
        })
      }, 1000)
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
