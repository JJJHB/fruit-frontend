<template>
  <div class="cart-page">
    <h2 class="title">🛒 我的购物车</h2>

    <div v-if="cartItems.length === 0" class="empty">
      购物车空空如也 🍎
    </div>

    <div v-else class="cart-container">

      <div class="cart-item" v-for="item in cartItems" :key="item.id">
        <img :src="item.image" class="img" />

        <div class="info">
          <div class="name">{{ item.name }}</div>
          <div class="price">￥{{ Number(item.price).toFixed(2) }}</div>

          <div class="count">
            <button @click="decrease(item)">-</button>
            <span>{{ item.count }}</span>
            <button @click="increase(item)">+</button>
          </div>
        </div>

        <div class="subtotal">
          ￥{{ (item.price * item.count).toFixed(2) }}
        </div>

        <!-- 单条下单按钮 -->
        <button class="checkout-single" @click="checkoutSingle(item)">
          下单
        </button>

        <button class="delete" @click="removeItem(item.id)">
          删除
        </button>
      </div>

      <div class="footer">
        <div class="total">
          总计：<span>￥{{ totalPrice.toFixed(2) }}</span>
        </div>

        <!-- 一键下单按钮 -->
        <button class="checkout" @click="checkoutAll">
          一键下单
        </button>
      </div>

    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CartView",
  data() {
    return {
      cartItems: [],
      fruitList: []
    };
  },
  computed: {
    totalPrice() {
      return this.cartItems.reduce((sum, item) => {
        return sum + (Number(item.price) || 0) * (Number(item.count) || 0);
      }, 0);
    }
  },
  mounted() {
    this.loadData();
  },
  methods: {

    // 一键下单
    async checkoutAll() {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.post(
        "http://localhost:8082/fruit-backend/cart",
        null,
        { params: { action: "checkout", userId: user.id } }
      );
      if (res.data.code === 200) {
        this.$message.success("下单成功");
        this.loadData();
      } else {
        this.$message.error(res.data.msg);
      }
    },

    // 单条下单
    async checkoutSingle(item) {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await axios.post(
        "http://localhost:8082/fruit-backend/cart",
        {
          userId: user.id,
          fruitId: item.fruitId,
          quantity: item.count
        },
        { params: { action: "checkoutSingle" } }
      );
      if (res.data.code === 200) {
        this.$message.success("单条下单成功");
        this.loadData();
      } else {
        this.$message.error(res.data.msg);
      }
    },

    // 以下为原有购物车逻辑
    loadData() {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) { alert("请先登录"); return; }

      fetch("http://localhost:8082/fruit-backend/fruitQueryList")
        .then(res => res.json())
        .then(res => {
          this.fruitList = res.fruits || [];
          this.fetchCart(user.id);
        })
        .catch(err => console.error("水果加载失败", err));
    },

    fetchCart(userId) {
      fetch(`http://localhost:8082/fruit-backend/cart?userId=${userId}`)
        .then(res => res.json())
        .then(cartData => {
          this.cartItems = cartData.map(item => {
            const fruit = this.fruitList.find(f => f.id === item.fruitId);
            return {
              id: item.id || item.fruitId,
              fruitId: item.fruitId,
              count: Number(item.quantity) || 1,
              name: fruit?.name || "未知水果",
              price: Number(fruit?.price) || 0,
              image: fruit?.picture
                ? `http://localhost:8082/fruit-backend/${fruit.picture}`
                : "http://localhost:8082/fruit-backend/upload/default.jpg"
            };
          });
        });
    },

    increase(item) { this.updateCount(item, item.count + 1); },
    decrease(item) { if (item.count > 1) this.updateCount(item, item.count - 1); },

    updateCount(item, count) {
      const formData = new URLSearchParams();
      formData.append("action", "update");
      formData.append("id", item.id);
      formData.append("count", count);

      fetch("http://localhost:8082/fruit-backend/cart", { method: "POST", body: formData })
        .then(res => res.json())
        .then(data => { if (data.code === 200) item.count = count; else alert(data.msg); });
    },

    removeItem(id) {
      if (!confirm("确定删除该商品吗？")) return;
      const formData = new URLSearchParams();
      formData.append("action", "delete");
      formData.append("id", id);

      fetch("http://localhost:8082/fruit-backend/cart", { method: "POST", body: formData })
        .then(res => res.json())
        .then(data => { if (data.code === 200) this.cartItems = this.cartItems.filter(i => i.id !== id); else alert(data.msg); });
    }
  }
};
</script>

<style scoped>
.cart-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial;
}

.title {
  text-align: center;
  margin-bottom: 20px;
}

.empty {
  text-align: center;
  color: #888;
  margin-top: 60px;
}

.cart-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.img {
  width: 70px;
  height: 70px;
  border-radius: 10px;
  margin-right: 12px;
}

.info {
  flex: 1;
}

.name {
  font-weight: bold;
}

.price {
  color: #ff4d4f;
  margin: 5px 0;
}

.count {
  display: flex;
  align-items: center;
  gap: 10px;
}

.count button {
  width: 25px;
  height: 25px;
}

.subtotal {
  width: 100px;
  text-align: center;
  font-weight: bold;
}

.delete {
  background: red;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 6px;
}

.footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid #eee;
}

.total span {
  color: red;
  font-size: 18px;
}

.checkout {
  background: green;
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
}
</style>