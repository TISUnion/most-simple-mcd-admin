<template>
  <div v-loading="loading" class="app-container">
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
    >
      <el-table-column
        prop="id"
        label="id"
      />
      <el-table-column
        prop="name"
        label="名称"
      />
      <el-table-column label="查看实时资源消耗">
        <template slot-scope="{row}">
          <router-link :to="row.id | addId"><el-button size="small" type="success">查看</el-button></router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/server'

export default {
  filters: {
    addId(value) {
      return '/resource/moni/' + value
    }
  },
  data() {
    return {
      loading: true,
      tableData: null
    }
  },
  created() {
    getList().then(Response => {
      this.tableData = Response.data
      this.loading = false
    })
  }
}
</script>
