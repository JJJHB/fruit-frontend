<template>
  <div class="cart-page">
    <h2 class="title">🛒 我的购物车</h2>

    <div v-if="cartItems.length === 0" class="empty">
      购物车空空如也 🍎
    </div>

    <div v-else class="cart-container">

      <!-- 商品卡片 -->
      <div class="cart-item" v-for="item in cartItems" :key="item.id">
        <img :src="item.image" class="img" />

        <div class="info">
          <div class="name">{{ item.name }}</div>
          <div class="price">￥{{ item.price.toFixed(2) }}</div>

          <!-- 数量控制 -->
          <div class="count">
            <button @click="decrease(item)">-</button>
            <span>{{ item.count }}</span>
            <button @click="increase(item)">+</button>
          </div>
        </div>

        <div class="subtotal">￥{{ (item.price * item.count).toFixed(2) }}</div>

        <button class="delete" @click="removeItem(item.id)">删除</button>
      </div>

      <!-- 总价 + 结算 -->
      <div class="footer">
        <div class="total">总计：<span>￥{{ totalPrice.toFixed(2) }}</span></div>
        <button class="checkout">去结算</button>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: "CartView",
  data() {
    return {
      cartItems: [
        {
          id: 1,
          name: "苹果",
          price: 5.5,
          count: 2,
          image: "http://localhost:8082/fruit-backend/upload/apple.jpg"
        },
        {
          id: 2,
          name: "香蕉",
          price: 3.0,
          count: 1,
          image: "http://localhost:8082/fruit-backend/upload/banana.jpg"
        }
      ]
    };
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce((sum, item) => sum + item.price * item.count, 0);
    }
  },
  methods: {
    increase(item) { item.count++; },
    decrease(item) { if (item.count > 1) item.count--; },
    removeItem(id) { this.cartItems = this.cartItems.filter(item => item.id !== id); }
  }
};
</script>

<style scoped>
.cart-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
}

.title {
  font-size: 26px;
  margin-bottom: 20px;
  text-align: center;
}

.empty {
  text-align: center;
  font-size: 18px;
  color: #999;
  margin-top: 80px;
}

.cart-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.08);
}

.img {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  margin-right: 15px;
}

.info {
  flex: 1;
}

.name {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 6px;
}

.price {
  color: #ff6b6b;
  font-size: 16px;
  margin-bottom: 10px;
}

.count {
  display: flex;
  align-items: center;
  gap: 10px;
}

.count button {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  background: #eee;
  cursor: pointer;
  font-weight: bold;
}

.count span {
  width: 24px;
  text-align: center;
}

.subtotal {
  width: 100px;
  text-align: center;
  font-weight: bold;
  color: #333;
}

.delete {
  margin-left: 10px;
  padding: 6px 12px;
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}
.delete:hover {
  background: #d9363e;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-top: 2px solid #f0f0f0;
}

.total span {
  color: #e91e63;
  font-weight: bold;
  font-size: 20px;
}

.checkout {
  background: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}
.checkout:hover {
  background: #45a049;
}
</style>