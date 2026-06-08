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
        :data="filteredUsers"
        border
        stripe
        max-height="600"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50" />

        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="username" label="账号" />
        <el-table-column prop="sex" label="性别" />
        <el-table-column prop="phone" label="手机" />

        <el-table-column label="余额">
          <template #default="scope">
            {{ Number(scope.row.money || 0).toFixed(2) }}
          </template>
        </el-table-column>

        <el-table-column label="头像" width="80">
          <template #default="scope">
            <el-image
              :src="scope.row.picture || defaultAvatar"
              style="width: 40px; height: 40px"
            />
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

    <!-- 弹窗 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">

      <el-form :model="form" label-width="80px">

        <el-form-item label="账号">
          <el-input v-model="form.username" />
        </el-form-item>

        <el-form-item label="性别">
          <el-input v-model="form.sex" />
        </el-form-item>

        <el-form-item label="手机">
          <el-input v-model="form.phone" />
        </el-form-item>

        <el-form-item label="余额">
          <el-input v-model="form.money" />
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
import { ref, onMounted, computed } from 'vue'
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
  username: '',
  sex: '',
  phone: '',
  picture: '',
  money: 0
})

/* ================= 查询 ================= */
const fetchUsers = async () => {
  const res = await axios.get('http://localhost:8082/fruit-backend/yonghuQueryList')

  if (res.data && Array.isArray(res.data.users)) {
    users.value = res.data.users.map(u => ({
      id: u.id,
      username: u.username,
      sex: u.sex || '',
      phone: u.phone || '',
      picture: u.picture ? `http://localhost:8082/fruit-backend/${u.picture}` : defaultAvatar,
      money: u.money ?? 0
    }))
  }
}

/* ================= 前端筛选 ================= */
const filteredUsers = computed(() => {
  return users.value.filter(u => {
    return (
      u.username.includes(accountQuery.value) &&
      (u.username.includes(nameQuery.value))
    )
  })
})

/* ================= 新增 ================= */
const handleAdd = () => {
  isEdit.value = false
  dialogTitle.value = '新增用户'

  form.value = {
    id: null,
    username: '',
    sex: '',
    phone: '',
    picture: '',
    money: 0
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

/* ================= 保存 ================= */
const handleSave = async () => {
  if (isEdit.value) {
    await axios.put('http://localhost:8082/fruit-backend/userUpdate', form.value)
  } else {
    await axios.post('http://localhost:8082/fruit-backend/userAdd', form.value)
  }

  dialogVisible.value = false
  fetchUsers()
}

/* ================= 删除 ================= */
const handleDelete = async (row) => {
  await axios.delete(`http://localhost:8082/fruit-backend/userDelete/${row.id}`)
  fetchUsers()
}

/* ================= 批量删除 ================= */
const handleDeleteBatch = async () => {
  if (!selectedUsers.value.length) return alert('请选择用户')

  const ids = selectedUsers.value.map(i => i.id)

  await axios.post('http://localhost:8082/fruit-backend/userDeleteBatch', ids)

  selectedUsers.value = []
  fetchUsers()
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