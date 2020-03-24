<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
      <el-table-column align="center" label="配置名" width="240">
        <template slot-scope="{row}">
          <span>{{ row.config_key }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="配置值" width="500">
        <template slot-scope="{row}">
          <template v-if="row.edit">
            <el-input v-model="row.config_val" class="edit-input" size="small" />
            <el-button
              class="cancel-btn"
              size="small"
              icon="el-icon-refresh"
              type="warning"
              @click="cancelEdit(row)"
            >
              cancel
            </el-button>
          </template>
          <span v-else>{{ row.config_val }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="配置说明" width="500">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="配置等级" width="50">
        <template slot-scope="{row}">
          <span>{{ row.level }}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="120">
        <template slot-scope="{row}">
          <el-button
            v-if="row.edit"
            type="success"
            size="small"
            icon="el-icon-circle-check-outline"
            @click="confirmEdit(row)"
          >
            确定
          </el-button>
          <el-button
            v-else
            type="primary"
            size="small"
            icon="el-icon-edit"
            :disabled="!row.is_alterable"
            @click="row.edit=!row.edit"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getList } from '@/api/config'
export default {
  name: 'Config',
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    async getList() {
      getList().then(response => {
        const items = response.data
        console.log(items)
        this.list = items.map(v => {
          v.origin_config_val = v.config_val
          this.$set(v, 'edit', false)
          return v
        })
      })
      this.listLoading = false
    },
    cancelEdit(row) {
      row.edit = false
      row.config_val = row.origin_config_val
      this.$message({
        message: 'The title has been restored to the original value',
        type: 'warning'
      })
    },
    confirmEdit(row) {
      row.edit = false
      this.$message({
        message: 'The title has been edited',
        type: 'success'
      })
    }
  }
}
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
