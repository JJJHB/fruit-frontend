<template>
  <div class="order-page">
    <h2 class="title">📦 我的订单</h2>

    <div v-if="orders.length === 0" class="empty">
      暂无订单 🥭
    </div>

    <div v-else class="order-container">

      <div class="order-card" v-for="order in orders" :key="order.id">
        <div class="order-header">
          <span>订单号：{{ order.id }}</span>
          <span class="status" :class="order.status">{{ order.status }}</span>
        </div>

        <div class="order-items">
          <div class="item" v-for="item in order.items" :key="item.id">
            <img :src="item.image" class="img" />
            <div class="info">
              <div class="name">{{ item.name }}</div>
              <div class="price">￥{{ item.price.toFixed(2) }} × {{ item.count }}</div>
            </div>
          </div>
        </div>

        <div class="order-footer">
          <div class="total">
            总价：<span>￥{{ orderTotal(order).toFixed(2) }}</span>
          </div>
          <button v-if="order.status === '未支付'" class="action" @click="payOrder(order.id)">去支付</button>
          <button v-else class="action disabled" disabled>已完成</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "OrderView",
  data() {
    return {
      orders: [
        {
          id: '20260608-001',
          status: '未支付',
          items: [
            { id: 1, name: '苹果', price: 5.5, count: 2, image: 'http://localhost:8082/fruit-backend/upload/apple.jpg' },
            { id: 2, name: '香蕉', price: 3.0, count: 1, image: 'http://localhost:8082/fruit-backend/upload/banana.jpg' }
          ]
        },
        {
          id: '20260608-002',
          status: '已支付',
          items: [
            { id: 3, name: '橙子', price: 4.0, count: 3, image: 'http://localhost:8082/fruit-backend/upload/orange.jpg' }
          ]
        }
      ]
    };
  },
  methods: {
    orderTotal(order) {
      return order.items.reduce((sum, item) => sum + item.price * item.count, 0);
    },
    payOrder(orderId) {
      alert(`订单 ${orderId} 支付功能待实现`);
    }
  }
};
</script>

<style scoped>
.order-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.title {
  font-size: 26px;
  text-align: center;
  margin-bottom: 20px;
}

.empty {
  text-align: center;
  font-size: 18px;
  color: #999;
  margin-top: 80px;
}

.order-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.08);
  padding: 15px;
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: bold;
}

.status {
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 14px;
  color: #fff;
}

.status.未支付 { background-color: #ff9800; }
.status.已支付 { background-color: #4caf50; }
.status.已发货 { background-color: #2196f3; }

.order-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.img {
  width: 70px;
  height: 70px;
  border-radius: 10px;
  object-fit: cover;
}

.info .name {
  font-weight: bold;
  font-size: 16px;
}

.info .price {
  color: #ff6b6b;
  margin-top: 4px;
}

.order-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.total span {
  color: #e91e63;
  font-weight: bold;
  font-size: 18px;
}

.action {
  background: #4caf50;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.action:hover {
  background: #45a049;
}

.action.disabled {
  background: #aaa;
  cursor: not-allowed;
}
</style>