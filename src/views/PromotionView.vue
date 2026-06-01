<template>
  <div class="promotion-container">
    <h2>促销活动列表</h2>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <span>水果名称:</span>
      <input type="text" v-model="search.shuiguomingcheng" placeholder="水果名称">
      
      <span>产地:</span>
      <input type="text" v-model="search.chandi" placeholder="产地">
      
      <span>水果分类:</span>
      <input type="text" v-model="search.shuiguofenlei" placeholder="水果分类">
      
      <button class="btn-query" @click="getList">查询</button>
      <button class="btn-add" @click="openModal()">新增促销</button>
    </div>

    <!-- 表格 -->
    <table border="1" width="100%">
      <thead>
        <tr>
          <th>ID</th>
          <th>添加时间</th>
          <th>水果名称</th>
          <th>水果分类</th>
          <th>产地</th>
          <th>单价(元)</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" :key="item.id">
          <td>{{ item.id }}</td>  
          <td>{{ formatDate(item.addtime) }}</td>
          <td>{{ item.shuiguomingcheng }}</td>
          <td>{{ item.shuiguofenlei }}</td>
          <td>{{ item.chandi }}</td>
          <td>{{ item.price }}</td>
          <td>
            <button @click="openModal(item)">修改</button>
            <button @click="handleDelete(item.id)">删除</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- 新增/修改弹窗 -->
    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <h3>{{ form.id ? '修改促销' : '新增促销' }}</h3>
        <div class="form-item">
          <label>水果名称：</label>
          <input type="text" v-model="form.shuiguomingcheng" required>
        </div>
        <div class="form-item">
          <label>水果分类：</label>
          <input type="text" v-model="form.shuiguofenlei" required>
        </div>
        <div class="form-item">
          <label>产地：</label>
          <input type="text" v-model="form.chandi" required>
        </div>
        <div class="form-item">
          <label>单价：</label>
          <input type="number" step="0.01" v-model="form.price" required placeholder="请输入价格">
        </div>
  
        <div class="modal-buttons">
          <button @click="submitForm">确定</button>
          <button @click="showModal = false">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PromotionView',
  data() {
    return {
      list: [],
      search: {
        shuiguomingcheng: '',
        chandi: '',
        shuiguofenlei: ''
      },
      showModal: false,
      form: {
        id: null,
        shuiguomingcheng: '',
        shuiguofenlei: '',
        chandi: '',
        price: ''
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // ====================== 日期格式化 ======================
    formatDate(date) {
      if (!date) return ''
      if (typeof date === 'object') {
        const year = date.year || date.getFullYear()
        const month = String((date.month ?? date.getMonth()) + 1).padStart(2, '0')
        const day = String(date.date ?? date.getDate()).padStart(2, '0')
        const hours = String(date.hours ?? date.getHours()).padStart(2, '0')
        const minutes = String(date.minutes ?? date.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day} ${hours}:${minutes}`
      }
      return date
    },

    // ====================== 查询列表 ======================
    async getList() {
      const params = new URLSearchParams();
      if (this.search.shuiguomingcheng) params.append('shuiguomingcheng', this.search.shuiguomingcheng);
      if (this.search.chandi) params.append('chandi', this.search.chandi);
      if (this.search.shuiguofenlei) params.append('shuiguofenlei', this.search.shuiguofenlei);

      const res = await fetch(`/api/fruit-backend/promotion?${params.toString()}`);
      const data = await res.json();
      this.list = data.promotions || [];
    },

    // ====================== 打开弹窗 ======================
    openModal(item = null) {
      this.showModal = true
      if (item) {
        this.form = { ...item }
      } else {
        this.form = {
          id: null,
          shuiguomingcheng: '',
          shuiguofenlei: '',
          chandi: '',
          price: ''
        }
      }
    },

    // ====================== 提交（新增/修改） 关键修复 ======================
    async submitForm() {
      // 1. 强制校验价格，必须是数字且大于0
      if (!this.form.price || isNaN(Number(this.form.price)) || Number(this.form.price) <= 0) {
        alert('请输入合法的价格！');
        return;
      }

      let url = '/api/fruit-backend/promotion';
      let method = 'POST';

      if (this.form.id) {
        url += `?action=update&id=${this.form.id}`;
      } else {
        url += `?action=add`;
      }

      // 2. 严格按照表单方式传参，和后端getParameter完全匹配
      const formData = new URLSearchParams();
      formData.append('shuiguomingcheng', this.form.shuiguomingcheng.trim());
      formData.append('shuiguofenlei', this.form.shuiguofenlei.trim());
      formData.append('chandi', this.form.chandi.trim());
      formData.append('price', Number(this.form.price)); // 确保是数字，不是字符串

      try {
        // 3. 显式设置Content-Type，和后端解析方式匹配
        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData
        });
        const data = await res.json();
        alert(data.msg);

        if (data.code === 200) {
          this.showModal = false;
          this.getList();
        }
      } catch (err) {
        console.error('提交失败：', err);
        alert('提交失败');
      }
    },

    // ====================== 删除 ======================
    async handleDelete(id) {
      if (!confirm('确定删除？')) return
      const res = await fetch(`/api/fruit-backend/promotion?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      alert(data.msg)
      this.getList()
    }
  }
}
</script>

<style scoped>
/* 去掉所有输入框箭头 */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}

.promotion-container {
  padding: 20px;
}
h2 {
  text-align: center;
  margin-bottom: 20px;
}
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
}
.btn-add {
  background: #27ae60;
  color: #fff;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
}
table {
  border-collapse: collapse;
  text-align: center;
  width: 100%;
}
th, td {
  padding: 8px;
  border: 1px solid #ddd;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
}
.form-item {
  margin: 15px 0;
}
.form-item label {
  display: inline-block;
  width: 80px;
}
.form-item input {
  width: calc(100% - 90px);
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
.modal-buttons button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.modal-buttons button:first-child {
  background: #409eff;
  color: #fff;
}
</style>