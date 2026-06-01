<template>
  <div class="user-management">
    <el-card>

      <!-- 顶部操作栏 -->
      <div class="header-bar">
        <span class="header-title">首页 ● 用户管理</span>

        <div class="header-actions">
          <el-input v-model="accountQuery" placeholder="账号" size="small" style="width: 140px" />
          <el-input v-model="nameQuery" placeholder="姓名" size="small" style="width: 140px" />

          <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
          <el-button type="success" size="small" @click="handleAdd">新增</el-button>
          <el-button type="danger" size="small" @click="handleDeleteBatch">批量删除</el-button>
        </div>
      </div>

      <!-- 表格 -->
      <el-table
        :data="users"
        border
        stripe
        max-height="600"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />

        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="account" label="账号" />
        <el-table-column prop="name" label="姓名" />
        <el-table-column prop="role" label="角色" />
        <el-table-column prop="phone" label="手机" />

        <el-table-column label="头像" width="80">
          <template #default="scope">
            <el-image
              :src="scope.row.avatar || defaultAvatar"
              style="width: 40px; height: 40px"
            />
          </template>
        </el-table-column>

        <el-table-column label="添加时间" width="180">
          <template #default="scope">
            {{ formatDate(scope.row.addtime) }}
          </template>
        </el-table-column>

        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleView(scope.row)">查看</el-button>
            <el-button type="warning" size="small" @click="handleEdit(scope.row)">修改</el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>

      </el-table>
    </el-card>

    <!-- ================== 弹窗 ================== -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">

      <el-form :model="form" label-width="80px">

        <el-form-item label="账号">
          <el-input v-model="form.account" />
        </el-form-item>

        <el-form-item label="姓名">
          <el-input v-model="form.name" />
        </el-form-item>

        <el-form-item label="角色">
          <el-input v-model="form.role" />
        </el-form-item>

        <el-form-item label="手机">
          <el-input v-model="form.phone" />
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

const accountQuery = ref('')
const nameQuery = ref('')

const dialogVisible = ref(false)
const dialogTitle = ref('')

const isEdit = ref(false)

const defaultAvatar = 'https://via.placeholder.com/40'

const form = ref({
  id: null,
  account: '',
  name: '',
  role: '',
  phone: '',
  avatar: ''
})

/* ================= 查询 ================= */
const fetchUsers = async () => {
  try {
    const res = await axios.get('http://localhost:8082/fruit-backend/userQueryList')

    if (res.data && Array.isArray(res.data.users)) {
      users.value = res.data.users.map(u => ({
        id: u.id,
        account: u.username,
        name: u.username,
        role: u.role || '普通用户',
        phone: u.phone || '',
        avatar: u.image ? `http://localhost:8082/fruit-backend/${u.image}` : '',
        addtime: u.addtime
      }))
    }
  } catch (e) {
    console.error(e)
  }
}

/* ================= 时间格式化 ================= */
const formatDate = (addtime) => {
  if (!addtime?.time) return ''
  const d = new Date(addtime.time)
  return d.toLocaleString()
}

/* ================= 新增 ================= */
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增用户'

  form.value = {
    id: null,
    account: '',
    name: '',
    role: '',
    phone: '',
    avatar: ''
  }

  dialogVisible.value = true
}

/* ================= 修改 ================= */
const handleEdit = (row) => {
  isEdit.value = true
  dialogTitle.value = '修改用户'
  form.value = { ...row }
  dialogVisible.value = true
}

/* ================= 查看 ================= */
const handleView = (row) => {
  alert(JSON.stringify(row, null, 2))
}

/* ================= 保存（新增/修改） ================= */
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

/* ================= 删除 ================= */
const handleDelete = async (row) => {
  try {
    await axios.delete(`http://localhost:8082/fruit-backend/userDelete/${row.id}`)
    fetchUsers()
  } catch (e) {
    console.error(e)
  }
}

/* ================= 批量删除 ================= */
const handleDeleteBatch = async () => {
  if (!selectedUsers.value.length) {
    return alert('请选择用户')
  }

  const ids = selectedUsers.value.map(i => i.id)

  try {
    await axios.post('http://localhost:8082/fruit-backend/userDeleteBatch', ids)
    selectedUsers.value = []
    fetchUsers()
  } catch (e) {
    console.error(e)
  }
}

/* ================= 选择 ================= */
const handleSelectionChange = (val) => {
  selectedUsers.value = val
}

/* ================= 查询按钮 ================= */
const handleSearch = () => {
  fetchUsers()
}

/* ================= 初始化 ================= */
onMounted(() => {
  fetchUsers()
})
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