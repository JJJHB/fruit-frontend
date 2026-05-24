<template>
  <div class="promotion-container">
    <h2>促销活动列表</h2>

    <!-- ✅ 新增：和示例一模一样的搜索栏 -->
    <div class="search-bar">
      <span>水果名称:</span>
      <input type="text" v-model="search.shuiguomingcheng" placeholder="水果名称">
      
      <span>产地:</span>
      <input type="text" v-model="search.chandi" placeholder="产地">
      
      <span>价格:</span>
      <input type="number" v-model="search.minPrice" placeholder="最小价格">
      <input type="number" v-model="search.maxPrice" placeholder="最大价格">
      
      <button class="btn-query" @click="getList">查询</button>
      <button class="btn-add" @click="handleAdd">新增促销</button>
    </div>

    <table border="1" width="100%">
      <thead>
        <tr>
          <th>ID</th>
          <th>添加时间</th>
          <th>水果名称</th>
          <th>水果分类</th>
          <th>产地</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" :key="item.id">
          <td>{{ item.id }}</td>  
          <td>{{ item.addtime }}</td>
          <td>{{ item.shuiguomingcheng }}</td>
          <td>{{ item.shuiguofenlei }}</td>
          <td>{{ item.chandi }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'PromotionView',
  data() {
    return {
      list: [],
      // ✅ 新增：搜索条件
      search: {
        shuiguomingcheng: '',
        chandi: '',
        minPrice: '',
        maxPrice: ''
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // ✅ 封装成方法，查询按钮直接调用
    getList() {
      // 把搜索条件传给后端（如果后端支持筛选的话）
      const params = new URLSearchParams();
      if (this.search.shuiguomingcheng) params.append('shuiguomingcheng', this.search.shuiguomingcheng);
      if (this.search.chandi) params.append('chandi', this.search.chandi);
      if (this.search.minPrice) params.append('minPrice', this.search.minPrice);
      if (this.search.maxPrice) params.append('maxPrice', this.search.maxPrice);

      fetch(`http://localhost:8082/fruit-backend/promotion?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
          this.list = data.promotions;
        })
        .catch(err => {
          console.error("请求错误：", err);
        });
    },
    // ✅ 新增：新增按钮事件（你可以自己写弹窗逻辑）
    handleAdd() {
      alert('打开新增促销弹窗（这里你可以写自己的新增逻辑）');
    }
  }
}
</script>

<style scoped>
.promotion-container {
  padding: 20px;
}
h2 {
  text-align: center;
  margin-bottom: 20px;
}

/* ✅ 新增：搜索栏样式，和示例完全匹配 */
.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
}
.search-bar span {
  font-size: 16px;
}
.search-bar input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}
.btn-query {
  background: #409eff;
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.btn-add {
  background: #27ae60;
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

table {
  border-collapse: collapse;
  text-align: center;
}
th, td {
  padding: 8px;
}
</style>