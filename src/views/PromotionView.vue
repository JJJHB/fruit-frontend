<template>
  <div class="promotion-container">
    <h2>促销活动列表</h2>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <span>促销标题:</span>
      <input type="text" v-model="search.title" placeholder="促销标题">
      
      <span>水果ID:</span>
      <input type="number" v-model="search.fruitId" placeholder="水果ID">
      
      <button class="btn-query" @click="getList">查询</button>
      <button class="btn-add" @click="openModal()">新增促销</button>
    </div>

    <!-- 表格 -->
    <table border="1" width="100%">
      <thead>
        <tr>
          <th>ID</th>
          <th>水果ID</th>
          <th>促销标题</th>
          <th>促销价(元)</th>
          <th>开始时间</th>
          <th>结束时间</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in list" :key="item.id">
          <td>{{ item.id }}</td>  
          <td>{{ item.fruitId }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.discountPrice }}</td>
          <td>{{ item.startTime }}</td>
          <td>{{ item.endTime }}</td>
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
          <label>水果ID：</label>
          <input type="number" v-model="form.fruitId" required>
        </div>
        <div class="form-item">
          <label>促销标题：</label>
          <input type="text" v-model="form.title" required>
        </div>
        <div class="form-item">
          <label>促销价：</label>
          <input type="number" step="0.01" v-model="form.discountPrice" required placeholder="请输入价格">
        </div>
        <div class="form-item">
          <label>开始时间：</label>
          <input type="text" v-model="form.startTime" placeholder="例：2026-06-01 12:00" required>
        </div>
        <div class="form-item">
          <label>结束时间：</label>
          <input type="text" v-model="form.endTime" placeholder="例：2026-06-01 12:00" required>
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
        title: '',
        fruitId: ''
      },
      showModal: false,
      form: {
        id: null,
        fruitId: '',
        title: '',
        discountPrice: '',
        startTime: '',
        endTime: ''
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // ====================== 查询列表 ======================
    async getList() {
      const params = new URLSearchParams();
      if (this.search.title) params.append('title', this.search.title);
      if (this.search.fruitId) params.append('fruitId', this.search.fruitId);

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
          fruitId: '',
          title: '',
          discountPrice: '',
          startTime: '',
          endTime: ''
        }
      }
    },

    // ====================== 提交（新增/修改） ======================
    async submitForm() {
      if (!this.form.fruitId || !this.form.title || !this.form.discountPrice || !this.form.startTime || !this.form.endTime) {
        alert('请填写所有必填项！');
        return;
      }
      if (isNaN(Number(this.form.discountPrice)) || Number(this.form.discountPrice) <= 0) {
        alert('请输入合法的促销价！');
        return;
      }

      let url = '/api/fruit-backend/promotion';
      let method = 'POST';

      if (this.form.id) {
        url += `?action=update&id=${this.form.id}`;
      }

      const formData = new URLSearchParams();
      formData.append('fruitId', this.form.fruitId);
      formData.append('title', this.form.title.trim());
      formData.append('discountPrice', Number(this.form.discountPrice));
      formData.append('startTime', this.form.startTime);
      formData.append('endTime', this.form.endTime);

      try {
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
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
  appearance: textfield;
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