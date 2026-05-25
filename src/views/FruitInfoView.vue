<template>
  <div class="admin-page">
    <div class="page-header">
      <h1>水果信息管理</h1>
      <p>添加、修改和删除水果信息，包含名称、价格、库存等基本字段。</p>
    </div>

    <!-- 搜索栏 -->
    <div class="search-area">
      <div class="search-item">
        <label>水果名称:</label>
        <input type="text" placeholder="水果名称" v-model="search.name" />
      </div>
      <div class="search-item">
        <label>产地:</label>
        <input type="text" placeholder="产地" v-model="search.chandi" />  <!-- 已修复 -->
      </div>
      <div class="search-item price">
        <label>价格:</label>
        <input type="text" placeholder="最小价格" v-model="search.minPrice" />
        <input type="text" placeholder="最大价格" v-model="search.maxPrice" />
      </div>
      <button class="search-btn" @click="handleSearch">查询</button>
      <button class="add-btn" @click="openAddDialog">新增水果</button>
    </div>

    <!-- 分类标签 -->
    <div class="category-bar">
      <span
        class="category-item"
        :class="{ active: activeCategory === '' }"
        @click="filterByCategory('')"
      >
        全部
      </span>
      <span
        class="category-item"
        :class="{ active: activeCategory === `水果分类${i}` }"
        @click="filterByCategory(`水果分类${i}`)"
        v-for="i in 8"
        :key="i"
      >
        水果分类{{ i }}
      </span>
    </div>

    <!-- 排序栏 -->
    <div class="sort-bar">
      <span class="sort-item" @click="sortByPrice">
        价格 {{ sortField === 'price' ? (sortAsc ? '↑' : '↓') : '⇄' }}
      </span>
      <span class="sort-item" @click="sortByClick">
        点击量 {{ sortField === 'clicknum' ? (sortAsc ? '↑' : '↓') : '⇄' }}
      </span>
      <span class="sort-item" @click="sortByStore">
        收藏数 {{ sortField === 'storeupnum' ? (sortAsc ? '↑' : '↓') : '⇄' }}
      </span>
      <span class="sort-item" @click="sortByThumb">
        点赞数 {{ sortField === 'thumbsupnum' ? (sortAsc ? '↑' : '↓') : '⇄' }}
      </span>
    </div>

    <!-- 水果列表 -->
    <div class="fruit-list">
      <div class="fruit-card" v-for="item in showList" :key="item.id">
        <div class="card-img">
          <img :src="item.shuiguotupian ? `${baseURL}/${item.shuiguotupian}` : 'https://via.placeholder.com/200'" alt="图片" />
        </div>
        <div class="card-info">
          <p class="fruit-name">{{ item.shuiguomingcheng }}</p>
          <p class="fruit-category">{{ item.shuiguofenlei }}</p>
          <p class="fruit-price">¥{{ item.price }}</p>
          <p class="meta">发布时间: {{ item.addtime }}</p>
          <p class="meta">点赞数: {{ item.thumbsupnum }}</p>
          <p class="meta">收藏量: {{ item.storeupnum }}</p>
          <p class="meta">点击量: {{ item.clicknum }}</p>
          <div class="card-actions">
            <button class="btn-edit" @click="handleEdit(item)">编辑</button>
            <button class="btn-delete" @click="handleDelete(item.id)">删除</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增弹窗 -->
    <div v-if="showAddDialog" class="dialog-mask">
      <div class="dialog">
        <h3>新增水果</h3>
        <div class="form-item">
          <label>水果名称</label>
          <input v-model="addForm.shuiguomingcheng" type="text" placeholder="请输入水果名称" />
        </div>
        <div class="form-item">
          <label>水果分类</label>
          <input v-model="addForm.shuiguofenlei" type="text" placeholder="请输入分类" />
        </div>
        <div class="form-item">
          <label>产地</label>
          <input v-model="addForm.chandi" type="text" placeholder="产地" />
        </div>
        <div class="form-item">
          <label>价格</label>
          <input v-model="addForm.price" type="number" placeholder="价格" />
        </div>
        <div class="form-item">
          <label>库存</label>
          <input v-model="addForm.alllimittimes" type="number" placeholder="库存" />
        </div>
        <div class="form-item">
          <label>图片地址</label>
          <input v-model="addForm.shuiguotupian" type="text" placeholder="图片名（如 1.jpg）" />
        </div>
        <div class="dialog-btns">
          <button @click="closeAddDialog">取消</button>
          <button @click="saveFruit">保存</button>
        </div>
      </div>
    </div>

    <!-- 编辑弹窗 -->
    <div v-if="showEditDialog" class="dialog-mask">
      <div class="dialog">
        <h3>编辑水果</h3>
        <div class="form-item">
          <label>水果名称</label>
          <input v-model="editForm.shuiguomingcheng" type="text" />
        </div>
        <div class="form-item">
          <label>水果分类</label>
          <input v-model="editForm.shuiguofenlei" type="text" />
        </div>
        <div class="form-item">
          <label>产地</label>
          <input v-model="editForm.chandi" type="text" />
        </div>
        <div class="form-item">
          <label>价格</label>
          <input v-model="editForm.price" type="number" />
        </div>
        <div class="form-item">
          <label>库存</label>
          <input v-model="editForm.alllimittimes" type="number" />
        </div>
        <div class="form-item">
          <label>图片地址</label>
          <input v-model="editForm.shuiguotupian" type="text" />
        </div>
        <div class="dialog-btns">
          <button @click="closeEditDialog">取消</button>
          <button @click="updateFruit">保存修改</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const baseURL = 'http://localhost:8082/fruit-backend'

// 数据列表
const fruitList = ref([])
const showList = ref([])
const activeCategory = ref('')

// 排序
const sortField = ref('')
const sortAsc = ref(true)

// 查询条件
const search = ref({
  name: '',
  chandi: '',
  minPrice: '',
  maxPrice: ''
})

// 新增
const showAddDialog = ref(false)
const addForm = ref({
  shuiguomingcheng: '',
  shuiguofenlei: '',
  chandi: '',
  price: '',
  alllimittimes: '',
  shuiguotupian: ''
})

// 编辑
const showEditDialog = ref(false)
const editForm = ref({
  id: '',
  shuiguomingcheng: '',
  shuiguofenlei: '',
  chandi: '',
  price: '',
  alllimittimes: '',
  shuiguotupian: ''
})

// 打开/关闭 新增
const openAddDialog = () => { showAddDialog.value = true }
const closeAddDialog = () => {
  showAddDialog.value = false
  addForm.value = { shuiguomingcheng: '', shuiguofenlei: '', chandi: '', price: '', alllimittimes: '', shuiguotupian: '' }
}

// 打开/关闭 编辑
const handleEdit = (item) => {
  editForm.value = { ...item }
  showEditDialog.value = true
}
const closeEditDialog = () => { showEditDialog.value = false }

// 保存新增
const saveFruit = async () => {
  try {
    const res = await axios.post(`${baseURL}/fruitAdd`, addForm.value, {
      headers: { 'Content-Type': 'application/json' }
    })

    // 👇👇 这里是关键修复 👇👇
    if (res.data.code === 200) {
      alert('新增成功！')
      closeAddDialog()
      fetchFruitList()
    } else {
      alert('新增失败：' + res.data.msg)
    }

  } catch (err) {
    console.error(err)
    alert('新增失败：服务器异常')
  }
}

// 保存编辑（修复版）
const updateFruit = async () => {
  try {
    const res = await axios.post(`${baseURL}/fruitUpdate`, editForm.value, {
      headers: { 'Content-Type': 'application/json' }
    })

    if (res.data.code === 200) {
      alert('修改成功！')
      closeEditDialog()
      fetchFruitList()
    } else {
      alert('修改失败：' + res.data.msg)
    }

  } catch (err) {
    console.error(err)
    alert('修改失败')
  }
}

// 删除
const handleDelete = async (id) => {
  if (!confirm('确定删除？')) return
  try {
    await axios.get(`${baseURL}/fruitDelete`, { params: { id } })
    alert('删除成功')
    fetchFruitList()
  } catch (err) {
    alert('删除失败')
  }
}

// 查询
const handleSearch = () => {
  fetchFruitList()  // 👈 直接重新请求后端查询！
}

// 获取列表
const fetchFruitList = async () => {
  try {
    const res = await axios.get(`${baseURL}/fruitQueryList`, { params: search.value })
    fruitList.value = res.data.fruits || []
    showList.value = [...fruitList.value]
  } catch (err) {
    console.error('获取失败', err)
  }
}

// 分类筛选
const filterByCategory = (category) => {
  activeCategory.value = category
  let list = [...fruitList.value]
  if (category) list = list.filter(item => item.shuiguofenlei === category)
  doSort(list)
}

// 排序
const doSort = (list) => {
  if (!sortField.value) {
    showList.value = list
    return
  }
  list.sort((a, b) => {
    const valA = Number(a[sortField.value]) || 0
    const valB = Number(b[sortField.value]) || 0
    return sortAsc.value ? valA - valB : valB - valA
  })
  showList.value = list
}

// 排序触发
const sortByPrice = () => {
  sortField.value === 'price' ? (sortAsc.value = !sortAsc.value) : (sortField.value = 'price', sortAsc.value = true)
  filterByCategory(activeCategory.value)
}
const sortByClick = () => {
  sortField.value === 'clicknum' ? (sortAsc.value = !sortAsc.value) : (sortField.value = 'clicknum', sortAsc.value = true)
  filterByCategory(activeCategory.value)
}
const sortByStore = () => {
  sortField.value === 'storeupnum' ? (sortAsc.value = !sortAsc.value) : (sortField.value = 'storeupnum', sortAsc.value = true)
  filterByCategory(activeCategory.value)
}
const sortByThumb = () => {
  sortField.value === 'thumbsupnum' ? (sortAsc.value = !sortAsc.value) : (sortField.value = 'thumbsupnum', sortAsc.value = true)
  filterByCategory(activeCategory.value)
}

onMounted(() => { fetchFruitList() })
</script>

<style>
.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}
.dialog {
  background: white;
  width: 500px;
  padding: 30px;
  border-radius: 16px;
}
.form-item {
  margin-bottom: 15px;
}
.form-item label {
  display: block;
  margin-bottom: 6px;
}
.form-item input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.dialog-btns {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
.dialog-btns button {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
}
.dialog-btns button:nth-child(2) {
  background: #409eff;
  color: white;
}
</style>

<style scoped>
.admin-page {
  background-color: #fff;
  min-height: 100vh;
  padding: 0 20px;
}
.page-header {
  background: linear-gradient(90deg, #409eff, #74c0fc);
  color: white;
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  margin-bottom: 30px;
}
.page-header h1 {
  margin: 0 0 10px;
  font-size: 28px;
}
.page-header p {
  margin: 0;
  font-size: 16px;
  opacity: .9;
}
.search-area {
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}
.search-item label {
  color: #2c3e50;
  font-size: 14px;
  margin-right: 5px;
}
.search-item input {
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
}
.search-area .price {
  display: flex;
  gap: 10px;
}
.search-btn {
  background: #409eff;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}
.add-btn {
  background: #27ae60;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}
.category-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.category-item {
  padding: 8px 16px;
  background: #f1f3f5;
  border-radius: 8px;
  font-size: 14px;
  color: #2c3e50;
  cursor: pointer;
}
.category-item.active {
  background: #409eff;
  color: white;
}
.sort-bar {
  display: flex;
  gap: 40px;
  margin-bottom: 30px;
  padding: 0 10px;
}
.sort-item {
  font-size: 14px;
  color: #2c3e50;
  cursor: pointer;
  user-select: none;
}
.fruit-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 25px;
}
.fruit-card {
  display: flex;
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0,0,0,0.05);
  padding: 15px;
}
.card-img {
  width: 200px;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 20px;
  background: #f8fafc;
}
.card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.fruit-name {
  font-size: 16px;
  font-weight: 500;
  color: #2c3e50;
  margin: 0 0 8px;
}
.fruit-category {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 10px;
}
.fruit-price {
  color: #e74c3c;
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 12px;
}
.meta {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0;
}
.card-actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}
.btn-edit {
  background: #409eff;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}
.btn-delete {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}
</style>