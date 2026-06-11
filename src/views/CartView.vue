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

          <div class="price">
            <div>
              <span style="text-decoration:line-through;color:#999;">
                单价原价：￥{{ item.originalPrice.toFixed(2) }}
              </span>
            </div>

            <div>
              <span style="color:red;">
                单价活动价：￥{{ item.finalPrice.toFixed(2) }}
              </span>
            </div>

            <div v-if="item.couponName">
              优惠券：{{ item.couponName }}
            </div>

            <div v-if="item.couponDiscount > 0">
              优惠金额：-￥{{ item.couponDiscount.toFixed(2) }}
            </div>

            <div style="font-weight:bold;">
              实际支付：
              ￥{{ getItemTotal(item).toFixed(2) }}
            </div>

            <!-- 优惠券选择（user_coupon.id） -->
            <select v-model="item.selectedUserCouponId" @change="applyCoupon(item)">
              <option :value="null">不使用优惠券</option>

              <option
                v-for="c in coupons"
                :key="c.id"
                :value="c.id"
              >
                {{ c.name }} (满{{ c.fullAmount }}减{{ c.reduceAmount }})
              </option>
            </select>

          </div>

          <div class="count">
            <button @click="decrease(item)">-</button>
            <span>{{ item.count }}</span>
            <button @click="increase(item)">+</button>
          </div>
        </div>

        <div class="subtotal">
          ￥{{ (item.finalPrice * item.count).toFixed(2) }}
        </div>

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

        <button class="checkout" @click="checkoutAll">
          一键下单
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const cartItems = ref([]);
const coupons = ref([]);

// ================= 总价 =================
const totalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    return sum + getItemTotal(item);
  }, 0);
});

// ================= 单项总价 =================
const getItemTotal = (item) => {
  const total = item.finalPrice * item.count;
  return Math.max(0, total - (item.couponDiscount || 0));
};

// ================= 加载数据 =================
const loadData = async () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (!user.id) return;

  const [rCart, rFruits, rUserCoupons, rCouponRules] = await Promise.all([
    axios.get("http://localhost:8082/fruit-backend/cart", {
      params: { userId: user.id }
    }),
    axios.get("http://localhost:8082/fruit-backend/fruitQueryList"),
    axios.get("http://localhost:8082/fruit-backend/coupon", {
      params: { userId: user.id }
    }),
    axios.get("http://localhost:8082/fruit-backend/coupon/list")
  ]);

  const fruits = rFruits.data?.fruits || [];

  // ================= 购物车 =================
  cartItems.value = (rCart.data || []).map(item => {
    const fruit = fruits.find(f => f.id == item.fruitId);

    return {
      id: item.id,
      fruitId: item.fruitId,
      count: item.quantity,

      name: fruit?.name || "未知",
      image: fruit?.picture
        ? `http://localhost:8082/fruit-backend/upload/${fruit.picture}`
        : "https://via.placeholder.com/70",

      originalPrice: fruit?.price || 0,
      finalPrice: fruit?.price || 0,

      couponDiscount: 0,
      couponName: null,

      selectedUserCouponId: null
    };
  });

  // ================= 优惠券 =================
  const ruleMap = new Map();
  (rCouponRules.data.data || []).forEach(c => {
    ruleMap.set(c.id, c);
  });

  coupons.value = (rUserCoupons.data?.data || []).map(uc => {
    const rule = ruleMap.get(uc.couponId);

    return {
      id: uc.id,          // user_coupon.id
      couponId: uc.couponId,
      name: rule?.name,
      fullAmount: rule?.fullAmount || 0,
      reduceAmount: rule?.reduceAmount || 0
    };
  });
};

// ================= 优惠券应用 =================
const applyCoupon = (item) => {

  const coupon = coupons.value.find(
    c => c.id == item.selectedUserCouponId
  );

  if (!coupon) {
    item.couponDiscount = 0;
    item.couponName = null;
    return;
  }

  const total = item.finalPrice * item.count;

  if (total >= coupon.fullAmount) {
    item.couponDiscount = coupon.reduceAmount;
    item.couponName = coupon.name;
  } else {
    alert("未满足优惠券使用条件");
    item.couponDiscount = 0;
    item.couponName = null;
    item.selectedUserCouponId = null;
  }
};

// ================= 数量 =================
const updateCount = async (item, count) => {
  const form = new URLSearchParams();
  form.append("action", "update");
  form.append("id", item.id);
  form.append("count", count);

  const res = await fetch("http://localhost:8082/fruit-backend/cart", {
    method: "POST",
    body: form
  });

  const data = await res.json();

  if (data.code === 200) {
    item.count = count;
    applyCoupon(item);
  }
};

const increase = (item) => updateCount(item, item.count + 1);
const decrease = (item) => {
  if (item.count > 1) updateCount(item, item.count - 1);
};

// ================= 删除 =================
const removeItem = async (id) => {
  const form = new URLSearchParams();
  form.append("action", "delete");
  form.append("id", id);

  await fetch("http://localhost:8082/fruit-backend/cart", {
    method: "POST",
    body: form
  });

  cartItems.value = cartItems.value.filter(i => i.id !== id);
};

// ================= 一键下单 =================
const checkoutAll = async () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const items = cartItems.value.map(i => ({
    fruitId: i.fruitId,
    quantity: i.count,
    couponId: i.selectedUserCouponId || null
  }));

  const res = await axios.post(
    "http://localhost:8082/fruit-backend/cart",
    { userId: user.id, items },
    { params: { action: "checkoutAll" } }
  );

  if (res.data.code === 200) {
    alert("下单成功");
    loadData();
  }
};

// ================= 单个下单 =================
const checkoutSingle = async (item) => {
  const user = JSON.parse(localStorage.getItem("user"));

  const res = await axios.post(
    "http://localhost:8082/fruit-backend/cart",
    {
      userId: user.id,
      items: [
        {
          fruitId: item.fruitId,
          quantity: item.count,
          couponId: item.selectedUserCouponId || null
        }
      ]
    },
    { params: { action: "checkoutSingle" } }
  );

  if (res.data.code === 200) {
    alert("下单成功");
    loadData();
  }
};

onMounted(loadData);
</script>

<style scoped>
.cart-page { max-width: 900px; margin: auto; padding: 20px; }
.title { text-align: center; }
.empty { text-align: center; color: #999; margin-top: 60px; }
.cart-container { display: flex; flex-direction: column; gap: 15px; }

.cart-item {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  padding: 10px;
}

.img { width: 70px; height: 70px; margin-right: 10px; }

.info { flex: 1; }

.count button {
  width: 25px;
  height: 25px;
}

.checkout, .checkout-single {
  background: #f60;
  color: #fff;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.delete {
  margin-left: 5px;
  background: #ccc;
  border: none;
  padding: 5px;
}

.footer {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>