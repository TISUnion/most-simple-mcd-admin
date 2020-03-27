<template>
  <div class="userinfo">
    <el-row>
      <el-col :span="24">
        <div>昵称：{{ nickname }}</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div>账号：{{ account }}</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div>密码：{{ password }}</div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <div>头像：{{ avatar }}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getInfo } from '@/api/user'
export default {
  data() {
    return {
      nickname: '',
      account: '',
      password: '',
      avatar: ''
    }
  },
  created() {
    getInfo().then(response => {
      const { data } = response
      this.nickname = data.nickname
      this.account = data.account
      this.avatar = data.avatar
    })
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
