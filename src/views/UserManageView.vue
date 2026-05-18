<template>
  <div class="user-management">
    <el-card>
      <!-- 标题与操作 -->
      <div class="header-bar">
        <span class="header-title">首页 ● 用户</span>
        <div class="header-actions">
          <el-input
            v-model="accountQuery"
            placeholder="请输入账号"
            size="small"
            style="width: 150px"
          />
          <el-input
            v-model="nameQuery"
            placeholder="请输入姓名"
            size="small"
            style="width: 150px"
          />
          <el-button type="primary" size="small" @click="handleSearch">Q 查询</el-button>
          <el-button type="success" size="small" @click="handleAdd">+ 添加</el-button>
          <el-button type="danger" size="small" @click="handleDeleteBatch">● 删除</el-button>
        </div>
      </div>

      <!-- 用户表格 -->
      <el-table
        :data="users"
        border
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
        max-height="600"
        :header-cell-style="{ background: '#f5f7fa', fontWeight: 'bold' }"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="id" label="序号" min-width="60"></el-table-column>
        <el-table-column prop="account" label="账号" min-width="100"></el-table-column>
        <el-table-column prop="name" label="姓名" min-width="100"></el-table-column>
        <el-table-column prop="role" label="角色" min-width="80"></el-table-column>
        <el-table-column prop="phone" label="手机" min-width="120"></el-table-column>
        <el-table-column prop="avatar" label="头像" min-width="80">
          <template #default="scope">
            <el-image :src="scope.row.avatar" class="avatar-image" />
          </template>
        </el-table-column>
        <el-table-column prop="addtime" label="添加时间" min-width="160">
          <template #default="scope">
            {{ formatDate(scope.row.addtime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="220">
          <template #default="scope">
            <el-space :size="6">
              <el-button type="primary" size="mini" @click="handleView(scope.row)">+ 查看</el-button>
              <el-button type="warning" size="mini" @click="handleEdit(scope.row)">之 修改</el-button>
              <el-button type="danger" size="mini" @click="handleDelete(scope.row)">宣 删除</el-button>
            </el-space>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const users = ref([])
const selectedUsers = ref([])

// 查询条件
const accountQuery = ref('')
const nameQuery = ref('')

// 格式化后端时间
const formatDate = (addtime) => {
  if (!addtime || !addtime.time) return ''
  const date = new Date(addtime.time)
  const yyyy = date.getFullYear()
  const mm = String(date.getMonth() + 1).padStart(2, '0')
  const dd = String(date.getDate()).padStart(2, '0')
  const hh = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  const ss = String(date.getSeconds()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd} ${hh}:${min}:${ss}`
}

// 请求后端获取用户列表
const fetchUsers = async () => {
  try {
    const res = await axios.get('http://localhost:8082/fruit-backend/userQueryList')
    if (res.data && Array.isArray(res.data.users)) {
      users.value = res.data.users.map((u, idx) => ({
        id: idx + 1,                   // 序号
        account: u.username,           // 账号
        name: u.username,              // 姓名
        role: u.role || '未知',        // 角色
        phone: u.phone || '',          // 手机
        avatar: u.image ? `http://localhost:8082/fruit-backend/${u.image}` : 'https://via.placeholder.com/40',
        addtime: u.addtime              // 添加时间
      }))
    }
  } catch (err) {
    console.error('获取用户列表失败', err)
  }
}

// 查询按钮
const handleSearch = () => {
  fetchUsers()
}

// 添加 / 查看 / 修改 / 删除操作
const handleAdd = () => console.log('添加用户')
const handleView = (user) => console.log('查看用户', user)
const handleEdit = (user) => console.log('修改用户', user)
const handleDelete = (user) => {
  console.log('删除用户', user)
  users.value = users.value.filter(u => u.id !== user.id)
}

// 批量选择
const handleSelectionChange = (val) => {
  selectedUsers.value = val
}

const handleDeleteBatch = () => {
  if (!selectedUsers.value.length) return alert('请先选择要删除的用户')
  const ids = selectedUsers.value.map(u => u.id)
  users.value = users.value.filter(u => !ids.includes(u.id))
  selectedUsers.value = []
}

// 页面加载时请求列表
onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.el-table th, .el-table td {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-management {
  padding: 20px;
}

.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header-title {
  font-size: 18px;
}

.header-actions {
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
}

.avatar-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
}
</style>