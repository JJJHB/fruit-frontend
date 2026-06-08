<template>
  <div class="user-management">
    <el-card>

      <!-- 顶部操作栏 -->
      <div class="header-bar">
        <span class="header-title">首页 ● 用户管理</span>
        <div class="header-actions">
          <el-input v-model="usernameQuery" placeholder="用户名" size="small" style="width: 140px" />
          <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
          <el-button type="success" size="small" @click="handleAdd">新增</el-button>
          <el-button type="danger" size="small" @click="handleDeleteBatch">批量删除</el-button>
        </div>
      </div>

      <!-- 用户表格 -->
      <el-table
        :data="users"
        border
        stripe
        max-height="600"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="password" label="密码" />
        <el-table-column prop="role" label="角色" />
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button type="warning" size="small" @click="handleEdit(scope.row)">修改</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>

    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" />
        </el-form-item>
        <el-form-item label="角色">
          <el-input v-model="form.role" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])
const selectedUsers = ref([])
const usernameQuery = ref('')

const dialogVisible = ref(false)
const dialogTitle = ref('')
const isEdit = ref(false)

const form = ref({
  id: null,
  username: '',
  password: '',
  role: ''
})

// 获取用户列表
const fetchUsers = async () => {
  try {
    const res = await axios.get('http://localhost:8082/fruit-backend/userQueryList')
    if (res.data && Array.isArray(res.data.users)) {
      users.value = res.data.users
    }
  } catch (e) {
    console.error(e)
  }
}

// 新增
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增用户'
  form.value = { id: null, username: '', password: '', role: '' }
  dialogVisible.value = true
}

// 修改
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '修改用户'
  form.value = { ...row }
  dialogVisible.value = true
}

// 保存
const handleSave = async () => {
  try {
    if (isEdit.value) {
      await axios.put('http://localhost:8082/fruit-backend/userUpdate', form.value)
    } else {
      await axios.post('http://localhost:8082/fruit-backend/userAdd', form.value)
    }
    dialogVisible.value = false
    fetchUsers()
  } catch (e) {
    console.error(e)
  }
}

// 删除
const handleDelete = async (row) => {
  try {
    await axios.delete(`http://localhost:8082/fruit-backend/userDelete/${row.id}`)
    fetchUsers()
  } catch (e) {
    console.error(e)
  }
}

// 批量删除
const handleDeleteBatch = async () => {
  if (!selectedUsers.value.length) return alert('请选择用户')
  const ids = selectedUsers.value.map(i => i.id)
  try {
    await axios.post('http://localhost:8082/fruit-backend/userDeleteBatch', ids)
    selectedUsers.value = []
    fetchUsers()
  } catch (e) {
    console.error(e)
  }
}

const handleSelectionChange = val => selectedUsers.value = val
const handleSearch = () => fetchUsers()

onMounted(() => fetchUsers())
</script>

<style scoped>
.user-management {
  padding: 20px;
}
.header-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  align-items: center;
}
.header-title {
  font-size: 18px;
  font-weight: bold;
}
.header-actions {
  display: flex;
  gap: 8px;
}
</style>