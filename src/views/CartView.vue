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
          <div class="price">￥{{ Number(item.price || 0).toFixed(2) }}</div>

          <!-- 数量控制 -->
          <div class="count">
            <button @click="decrease(item)">-</button>
            <span>{{ item.count }}</span>
            <button @click="increase(item)">+</button>
          </div>
        </div>

        <div class="subtotal">￥{{ (Number(item.price || 0) * Number(item.count || 0)).toFixed(2) }}</div>

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
      cartItems: []  // 初始为空
    };
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce(
        (sum, item) => sum + Number(item.price || 0) * Number(item.count || 0),
        0
      );
    }
  },
  mounted() {
    this.fetchCart();
  },
  methods: {

    // 增加数量
    increase(item) {
      const newCount = item.count + 1;

      fetch(
        `http://localhost:8082/fruit-backend/cartupdate?id=${item.id}&count=${newCount}`,
        {
          method: "POST"
        }
      )
        .then(res => res.json())
        .then(data => {
          if (data.code === 200) {
            item.count = newCount;
          } else {
            alert(data.msg);
          }
        });
    },

    // 减少数量
    decrease(item) {
      if (item.count <= 1) return;

      const newCount = item.count - 1;

      fetch(
        `http://localhost:8082/fruit-backend/cartupdate?id=${item.id}&count=${newCount}`,
        {
          method: "POST"
        }
      )
        .then(res => res.json())
        .then(data => {
          if (data.code === 200) {
            item.count = newCount;
          } else {
            alert(data.msg);
          }
        });
    },

    // 删除商品
    removeItem(id) {
      if (!confirm("确定删除该商品吗？")) {
        return;
      }

      fetch(
        `http://localhost:8082/fruit-backend/cart/delete?id=${id}`,
        {
          method: "POST"
        }
      )
        .then(res => res.json())
        .then(data => {
          if (data.code === 200) {
            this.cartItems = this.cartItems.filter(
              item => item.id !== id
            );
          } else {
            alert(data.msg);
          }
        });
    },

    fetchCart() {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user || !user.id) {
        alert("请先登录");
        return;
      }

      fetch(`http://localhost:8082/fruit-backend/cart?userId=${user.id}`)
        .then(res => res.json())
        .then(data => {
          this.cartItems = data;
        })
        .catch(err => console.error(err));
    }
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