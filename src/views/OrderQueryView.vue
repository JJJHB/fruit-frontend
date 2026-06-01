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
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 订单列表 -->
    <div class="order-list">
      <div
        v-for="order in filteredOrders"
        :key="order.id"
        class="order-item"
      >
        <div>订单号：{{ order.id }}</div>
        <div>金额：￥{{ order.amount }}</div>
        <div>状态：{{ order.status }}</div>
      </div>

      <div v-if="filteredOrders.length === 0" class="empty">
        暂无订单
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "OrderQueryView",
  data() {
    return {
      activeTab: "unpaid",

      tabs: [
        { key: "unshipped", label: "已发货订单" },
        { key: "unpaid", label: "未支付订单" },
        { key: "paid", label: "已支付订单" },
        { key: "finished", label: "已完成订单" },
        { key: "cancelled", label: "已取消订单" },
        { key: "refunded", label: "已退款订单" }
      ],

      // 模拟数据（你后面可以换成接口）
      orders: [
        { id: "A001", amount: 99, status: "unpaid" },
        { id: "A002", amount: 199, status: "paid" },
        { id: "A003", amount: 59, status: "unshipped" },
        { id: "A004", amount: 39, status: "finished" },
        { id: "A005", amount: 88, status: "cancelled" },
        { id: "A006", amount: 128, status: "refunded" }
      ]
    };
  },

  computed: {
    filteredOrders() {
      return this.orders.filter(o => o.status === this.activeTab);
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