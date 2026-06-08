<template>
  <div class="view-card">
    <h2>订单查询与管理</h2>
    <p>查看订单状态、搜索订单号并管理订单流程。</p>

    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="{ active: activeTab === tab.key }"
        @click="switchTab(tab.key)"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 订单列表 -->
    <div class="order-list">
      <div
        v-for="order in orders"
        :key="order.id"
        class="order-item"
      >
        <div>订单号：{{ order.id }}</div>
        <div>用户ID：{{ order.userId }}</div>
        <div>收货地址ID：{{ order.addressId }}</div>
        <div>水果ID：{{ order.fruitId }}</div>
        <div>数量：{{ order.quantity }}</div>
        <div>单价：￥{{ order.price }}</div>
        <div>总价：￥{{ order.totalPrice }}</div>
        <div>状态：{{ order.status }}</div>
        <div>下单时间：{{ order.createTime }}</div>
      </div>

      <div v-if="orders.length === 0" class="empty">
        暂无订单
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "OrderQueryView",
  data() {
    return {
      tabs: [
        { key: "待支付", label: "待支付" },
        { key: "已支付", label: "已支付" },
        { key: "待发货", label: "待发货" },
        { key: "已发货", label: "已发货" },
        { key: "已完成", label: "已完成" }
      ],
      activeTab: "待支付", // 默认显示“待支付”
      orders: []
    };
  },
  mounted() {
    this.fetchOrders(this.activeTab);
  },
  methods: {
    // 切换Tab
    switchTab(tabKey) {
      this.activeTab = tabKey;
      this.fetchOrders(tabKey);
    },

    // 从后端获取订单
    fetchOrders(status) {
      axios
        .get("http://localhost:8082/fruit-backend/ordersQuery", {
          params: { status }
        })
        .then(res => {
          this.orders = res.data;
        })
        .catch(err => {
          console.error("获取订单失败:", err);
          this.orders = [];
        });
    }
  }
};
</script>

<style scoped>
.view-card {
  padding: 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(16, 39, 80, 0.08);
}

h2 {
  margin-bottom: 12px;
}

p {
  color: #4a5568;
  margin-bottom: 16px;
}

/* tabs */
.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
}

.tabs button {
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 8px;
  cursor: pointer;
}

.tabs button.active {
  background: #409eff;
  color: white;
  border-color: #409eff;
}

/* order list */
.order-list {
  display: grid;
  gap: 12px;
}

.order-item {
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 10px;
  background: #fafafa;
}

.empty {
  color: #888;
  text-align: center;
  padding: 20px;
}
</style>