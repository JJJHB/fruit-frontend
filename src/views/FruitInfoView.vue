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
        :class="{ active: activeCategory === cate }"
        @click="filterByCategory(cate)"
        v-for="cate in cateList"
        :key="cate"
      >
        {{ cate }}
      </span>
    </div>

    <!-- 排序栏 -->
    <div class="sort-bar">
      <span class="sort-item" @click="sortByPrice">
  价格 {{ sortField === 'price' ? (sortState===1?'↑':sortState===2?'↓':'⇄') : '⇄' }}
</span>
<span class="sort-item" @click="sortByClick">
  点击量 {{ sortField === 'clicknum' ? (sortState===1?'↑':sortState===2?'↓':'⇄') : '⇄' }}
</span>
    </div>

    <!-- 水果列表 -->
    <div class="fruit-list">
      <div class="fruit-card" v-for="item in showList" :key="item.id">
        <div class="card-img">
          <img :src="item.picture ? `${baseURL}/upload/${item.picture}` : 'https://via.placeholder.com/200'" alt="图片" />
        </div>
        <div class="card-info">
          <p class="fruit-name">{{ item.name }}</p>
          <p class="fruit-category">分类：{{ item.categoryName }}</p>
          <p class="fruit-price">¥{{ item.price }}</p>
          <p class="meta">库存数量：{{ item.stock }}件</p>
          <p class="meta">详情：{{ item.detail }}</p>
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
          <input v-model="addForm.name" type="text" placeholder="请输入水果名称" />
        </div>
        <div class="form-item">
          <label>水果分类</label>
          <select v-model="addForm.categoryId" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:8px;">
            <option value="">--请选择分类--</option>
            <option v-for="item in cateSelectList" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
        <div class="form-item">
          <label>价格</label>
          <input v-model="addForm.price" type="number" placeholder="价格" />
        </div>
        <div class="form-item">
          <label>库存</label>
          <input v-model="addForm.stock" type="number" placeholder="库存" />
        </div>
        <div class="form-item">
          <label>详情/产地</label>
          <input v-model="addForm.detail" type="text" placeholder="填写详情产地" />
        </div>
        <div class="form-item">
          <label>上传水果图片</label>
          <input type="file" accept="image/*" @change="uploadImgAdd($event)">
          <span style="color:#666">已选：{{ addForm.picture || '未上传' }}</span>
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
          <input v-model="editForm.name" type="text" />
        </div>
        <div class="form-item">
          <label>水果分类</label>
          <select v-model="editForm.categoryId" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:8px;">
            <option value="">--请选择分类--</option>
            <option v-for="item in cateSelectList" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select>
        </div>
        <div class="form-item">
          <label>价格</label>
          <input v-model="editForm.price" type="number" />
        </div>
        <div class="form-item">
          <label>库存</label>
          <input v-model="editForm.stock" type="number" />
        </div>
        <div class="form-item">
          <label>重新上传图片(不换图留空)</label>
          <input type="file" accept="image/*" @change="uploadImgEdit($event)">
          <span style="color:#666">原图：{{ editForm.picture || '无' }}</span>
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

// ------------------------------------ 定义初始化 ---------------------------------------
// 数据列表
const fruitList = ref([])
const showList = ref([])
const activeCategory = ref('')
// 存放自动提取的分类名称
const cateList = ref([])
// 排序
const sortField = ref('')
const sortState = ref(0) // 0默认、1升序↑、2降序↓
// 查询条件
const search = ref({
  name: '',
  minPrice: '',
  maxPrice: ''
})
// 下拉分类数据源 {id,name}
const cateSelectList = ref([])

// ------------------------------------ 查询和分类标签---------------------------------------
// 查询
const handleSearch = () => {
  fetchFruitList()  // 👈 直接重新请求后端查询！
}

// 获取列表 + 自动提取分类
const fetchFruitList = async () => {
  try {
    // 查询后重置排序为默认
    sortField.value = ''
    sortState.value = 0
    const res = await axios.get(`${baseURL}/fruitQueryList`, { params: search.value })
    fruitList.value = res.data.fruits || []
    let temp = [...fruitList.value]
    if(activeCategory.value){
      temp = temp.filter(item=>item.categoryName === activeCategory.value)
    }
    showList.value = temp
    const cates = [...new Set(fruitList.value.map(item => item.categoryName))]
    cateList.value = cates
  } catch (err) {
    console.error('获取失败', err)
  }
}

// 分类筛选
const filterByCategory = (category) => {
  activeCategory.value = category
  let list = [...fruitList.value]
  if (category) list = list.filter(item => item.categoryName === category)
  doSort(list)
}

// ------------------------------------ 排序按钮 ---------------------------------------
// 排序
const doSort = (list) => {
  // sortState=0 不排序，直接原数组
  if (sortState.value === 0) {
    showList.value = [...list]
    return
  }
  const arr = [...list]
  arr.sort((a, b) => {
    const valA = Number(a[sortField.value]) || 0
    const valB = Number(b[sortField.value]) || 0
    //1升序，2降序
    return sortState.value === 1 ? valA - valB : valB - valA
  })
  showList.value = arr
}

// 价格排序：默认→升序→降序→默认 循环
const sortByPrice = ()=>{
  if(sortField.value !== 'price'){
    sortField.value = 'price'
    sortState.value = 1
  }else{
    sortState.value = sortState.value >=2 ? 0 : sortState.value+1
  }
  filterByCategory(activeCategory.value)
}

// 点击量排序循环
const sortByClick = ()=>{
  if(sortField.value !== 'clicknum'){
    sortField.value = 'clicknum'
    sortState.value = 1
  }else{
    sortState.value = sortState.value >=2 ? 0 : sortState.value+1
  }
  filterByCategory(activeCategory.value)
}

// ------------------------------------ 新增按钮 ---------------------------------------
// 加载下拉全部分类
const loadSelectCate = async ()=>{
  const res = await axios.get(`${baseURL}/getAllCate`)
  cateSelectList.value = res.data
}

// 新增
const showAddDialog = ref(false)
const addForm = ref({
  name: '',
  categoryId: '', // 存分类数字ID！！
  detail: '',
  price: '',
  stock: '',
  picture: '',
  clicknum: 0
})

// 打开/关闭 新增
const openAddDialog = () => { showAddDialog.value = true }
const closeAddDialog = () => {
  showAddDialog.value = false
  addForm.value = {
    name: '',
    categoryId: '',
    detail: '',
    price: '',
    stock: '',
    picture: '',
    clicknum: 0
  }
}

// 新增弹窗上传图片
const uploadImgAdd = async(e)=>{
  let file = e.target.files[0]
  if(!file) return
  let formData = new FormData()
  formData.append("img",file)
  let res = await axios.post(`${baseURL}/uploadImg`,formData,{
    headers:{"Content-Type":"multipart/form-data"}
  })
  if(res.data.code === 200){
    // 把文件名存入表单，提交时存入数据库picture字段
    addForm.value.picture = res.data.fileName
  }
}

// 保存新增
const saveFruit = async () => {
  try {
    const formData = {
      ...addForm.value,
      categoryId: Number(addForm.value.categoryId),
      price: Number(addForm.value.price) || 0,
      stock: Number(addForm.value.stock) || 0,
      clicknum: Number(addForm.value.clicknum) || 0
    }

    const res = await axios.post(`${baseURL}/fruitAdd`, formData, {
      headers: { 'Content-Type': 'application/json' }
    })

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

// ------------------------------------ 编辑按钮 ---------------------------------------
// 编辑
const showEditDialog = ref(false)
const editForm = ref({
  id: '',
  name: '',
  categoryId: '',
  detail: '',
  price: '',
  stock: '',
  picture: '',
  clicknum: 0
})

// 打开/关闭 编辑
const handleEdit = (item) => {
  editForm.value = {
    id: item.id,
    name: item.name,
    categoryId: item.categoryId ?? '', // 数据库分类ID赋值给下拉
    detail: item.detail ?? '',
    price: item.price,
    stock: item.stock,
    picture: item.picture ?? '',
    clicknum: item.clicknum ?? 0
  }
  showEditDialog.value = true
}
const closeEditDialog = () => {
  showEditDialog.value = false
  // 关闭清空编辑表单
  editForm.value = {
    id: '',
    name: '',
    categoryId: '',
    detail: '',
    price: '',
    stock: '',
    picture: '',
    clicknum: 0
  }
}

// 编辑弹窗上传图片
const uploadImgEdit = async(e)=>{
  let file = e.target.files[0]
  if(!file) return
  let formData = new FormData()
  formData.append("img",file)
  let res = await axios.post(`${baseURL}/uploadImg`,formData,{
    headers:{"Content-Type":"multipart/form-data"}
  })
  if(res.data.code === 200){
    editForm.value.picture = res.data.fileName
  }
}

// 保存编辑
const updateFruit = async () => {
  try {
    const formData = {
      ...editForm.value,
      categoryId: Number(editForm.value.categoryId),
      price: Number(editForm.value.price) || 0,
      stock: Number(editForm.value.stock) || 0,
      clicknum: Number(editForm.value.clicknum) || 0
    }
    const res = await axios.post(`${baseURL}/fruitUpdate`, formData, {
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
    alert('修改失败：服务器异常')
  }
}

// ------------------------------------ 删除按钮 ---------------------------------------
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

onMounted(() => { fetchFruitList() ,loadSelectCate() })
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
  transition: all 0.2s;
}
.category-item.active {
  background: #409eff;
  color: white;
}
.category-item:hover:not(.active) {
  background:#e1e5e9;
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