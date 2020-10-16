<template>
  <div class="userinfo">
    <el-row>
      <el-col :span="24">
        <div v-if="!isSure">昵称：{{ nickname }}</div>
        <div v-else class="filter-container">昵称：<el-input v-model="nickname" style="width: 20vh;margin: 0;" class="filter-item" placeholder="昵称" size="small" /></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div v-if="!isSure">账号：{{ account }}</div>
        <div v-else class="filter-container">账号：<el-input v-model="account" style="width: 20vh;margin: 0;" class="filter-item" placeholder="账号" size="small" /></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div v-if="!isSure">密码：{{ password }}</div>
        <div v-else class="filter-container">密码：<el-input v-model="password" style="width: 20vh;margin: 0;" class="filter-item" placeholder="密码" size="small" /></div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div class="filter-container">
          <span>操作：</span>
          <el-button v-if="!isSure" class="filter-item" style="margin: 0;" size="small" type="primary" @click="isSure=true">
            编辑
          </el-button>
          <el-button v-else class="filter-item" style="margin: 0;" size="small" type="success" @click="updateUserInfo">
            确定
          </el-button>
          <el-button class="filter-item" style="margin: 0;" size="small" type="danger" @click="deteleTmpDate">
            删除缓存
          </el-button>
          <el-button class="filter-item" style="margin: 0;" size="small" type="warning" @click="closeSystem">
            关闭mcd
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getInfo, updateUserData } from '@/api/user'
import { delTmpFlie, closeSystem } from '@/api/server'
export default {
  data() {
    return {
      nickname: '',
      account: '',
      password: '',
      avatar: '',
      isSure: false
    }
  },
  created() {
    getInfo().then(response => {
      const { data } = response
      this.nickname = data.nickname
      this.account = data.account
      this.avatar = data.avatar
    })
  },
  methods: {
    updateUserInfo() {
      this.$confirm(`是否修改信息?`, '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateUserData({
          nickname: this.nickname,
          account: this.account,
          password: this.password
        }).then(Response => {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          this.$store.commit('user/RESET_STATE')
          this.$router.push('/login')
          this.password = ''
        })
      })
      this.isSure = !this.isSure
    },
    deteleTmpDate() {
      this.$confirm(`是否删除缓存?`, '确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delTmpFlie().then(() => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      })
    },
    closeSystem() {
      closeSystem().then()
      this.$message({
        message: '关闭成功',
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 3vh;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  font-size: 2.8vh;
}
.userinfo {
  margin: 5vh 3vw;
}
</style>
