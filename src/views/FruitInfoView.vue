<template>
  <div class="admin-page">

    <!-- 页面标题栏 -->
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
        <input type="text" placeholder="产地" v-model="search.origin" />
      </div>
      <div class="search-item price">
        <label>价格:</label>
        <input type="text" placeholder="最小价格" v-model="search.minPrice" />
        <input type="text" placeholder="最大价格" v-model="search.maxPrice" />
      </div>
      <button class="search-btn" @click="handleSearch">查询</button>
      <button class="add-btn" @click="handleAdd">新增水果</button>
    </div>

    <!-- 分类标签 -->
    <div class="category-bar">
      <span class="category-item active">全部</span>
      <span class="category-item" v-for="i in 8" :key="i">水果分类{{i}}</span>
    </div>

    <!-- 排序栏 -->
    <div class="sort-bar">
      <span class="sort-item">价格 ⇄</span>
      <span class="sort-item">点击量 ⇄</span>
      <span class="sort-item">收藏数 ☆</span>
      <span class="sort-item">点赞数 👍</span>
    </div>

    <!-- 水果列表卡片 -->
    <div class="fruit-list">
      <div class="fruit-card" v-for="item in filteredList" :key="item.id">
        <div class="card-img">
          <img :src="item.img" alt="水果图片" />
        </div>
        <div class="card-info">
          <p class="fruit-name">{{ item.name }}</p>
          <p class="fruit-category">{{ item.category }}</p>
          <p class="fruit-price">¥{{ item.price }}</p>
          <p class="meta">发布时间: {{ item.time }}</p>
          <p class="meta">点赞数: {{ item.like }}</p>
          <p class="meta">收藏量: {{ item.collect }}</p>
          <p class="meta">点击量: {{ item.click }}</p>
          <div class="card-actions">
            <button class="btn-edit" @click="handleEdit(item)">编辑</button>
            <button class="btn-delete" @click="handleDelete(item)">删除</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FruitInfoView',
  data() {
    return {
      search: {
        name: '',
        origin: '',
        minPrice: '',
        maxPrice: ''
      },
      // 原始数据
      fruitList: [
        { id: 1, name: '苹果', category: '水果分类1', price: 8.8, origin: '山东', time: '2025-02-26', like: 8, collect: 8, click: 9, img: '' },
        { id: 2, name: '香蕉', category: '水果分类2', price: 5.5, origin: '海南', time: '2025-02-26', like: 7, collect: 7, click: 7, img: '' },
        { id: 3, name: '草莓', category: '水果分类3', price: 39.9, origin: '辽宁', time: '2025-02-26', like: 6, collect: 6, click: 6, img: '' },
        { id: 4, name: '西瓜', category: '水果分类4', price: 2.9, origin: '河南', time: '2025-02-26', like: 5, collect: 5, click: 5, img: '' }
      ]
    }
  },
  computed: {
    // 筛选后的列表（查询核心）
    filteredList() {
      let { name, origin, minPrice, maxPrice } = this.search
      let list = [...this.fruitList]

      // 1. 按名称模糊查询
      if (name) {
        list = list.filter(item => item.name.includes(name))
      }

      // 2. 按产地模糊查询
      if (origin) {
        list = list.filter(item => item.origin.includes(origin))
      }

      // 3. 最小价格
      if (minPrice) {
        list = list.filter(item => item.price >= Number(minPrice))
      }

      // 4. 最大价格
      if (maxPrice) {
        list = list.filter(item => item.price <= Number(maxPrice))
      }

      return list
    }
  },
  methods: {
    handleSearch() {
      console.log('查询条件：', this.search)
      // 已经自动筛选，这里只需提示即可
      alert('查询成功，共找到 ' + this.filteredList.length + ' 条数据')
    },
    handleAdd() {
      console.log('新增水果')
    },
    handleEdit(item) {
      console.log('编辑水果:', item)
    },
    handleDelete(item) {
      if (confirm('确定删除该水果吗？')) {
        console.log('删除水果:', item)
      }
    }
  }
}
</script>

<style scoped>
.admin-page {
  background-color: #ffffff;
  min-height: 100vh;
  padding: 0 20px;
}

/* 蓝色标题栏（和首页风格一致） */
.page-header {
  background: linear-gradient(90deg, #409eff, #74c0fc);
  color: white;
  padding: 30px;
  border-radius: 16px;
  text-align: center;
  margin-bottom: 30px;
}
.page-header h1 {
  margin: 0 0 10px 0;
  font-size: 28px;
}
.page-header p {
  margin: 0;
  font-size: 16px;
  opacity: 0.9;
}

/* 搜索栏 */
.search-area {
  background-color: #f8fafc;
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
  align-items: center;
  gap: 10px;
}
.search-btn {
  background-color: #409eff;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}
.add-btn {
  background-color: #27ae60;
  color: white;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

/* 分类栏 */
.category-bar {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.category-item {
  padding: 8px 16px;
  background-color: #f1f3f5;
  border-radius: 8px;
  font-size: 14px;
  color: #2c3e50;
  cursor: pointer;
}
.category-item.active {
  background-color: #409eff;
  color: white;
}

/* 排序栏 */
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
}

/* 水果列表 */
.fruit-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  gap: 25px;
}
.fruit-card {
  display: flex;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
  padding: 15px;
}
.card-img {
  width: 200px;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  margin-right: 20px;
  background-color: #f8fafc;
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
  margin: 0 0 8px 0;
}
.fruit-category {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 10px 0;
}
.fruit-price {
  color: #e74c3c;
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 12px 0;
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
  background-color: #409eff;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}
.btn-delete {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 6px 14px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}
</style>