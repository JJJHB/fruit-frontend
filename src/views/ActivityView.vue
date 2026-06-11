<template>
  <div class="activity-page">

    <h2 class="title">🎉 活动中心</h2>

    <!-- 每日领券 -->
    <div class="card">
      <h3>🎁 每日领券</h3>

      <p class="desc">
        每天可领取一次随机优惠券
      </p>

      <button
        class="btn receive-btn"
        @click="receiveCoupon"
      >
        立即领取
      </button>
    </div>

    <!-- 砸金蛋 -->
    <div class="card">
      <h3>🥚 幸运砸金蛋</h3>

      <p class="desc">
        每天最多可砸 3 次
      </p>

      <button
        class="btn egg-btn"
        @click="smashEgg"
      >
        开始砸蛋
      </button>
    </div>

    <!-- 我的优惠券 -->
    <div class="card">
      <h3>🎫 我的优惠券</h3>

      <div
        v-if="couponList.length === 0"
        class="empty"
      >
        暂无优惠券
      </div>

      <div
        v-for="item in couponList"
        :key="item.id"
        class="coupon-item"
      >
        <div class="coupon-left">
          <span class="money">
            ￥{{ item.discount }}
          </span>
        </div>

        <div class="coupon-right">
          <p>优惠券</p>
          <small>
            {{ formatTime(item.createTime) }}
          </small>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ActivityView",

  data() {
    return {
      userId: localStorage.getItem("userId"),
      couponList: []
    };
  },

  mounted() {
    this.loadCoupons();
  },

  methods: {

    // 加载优惠券
    loadCoupons() {
      axios
        .get(`http://localhost:8082/fruit-backend/coupon?userId=${this.userId}`)
        .then(res => {
          this.couponList = res.data || [];
        })
        .catch(() => {
          console.log("加载优惠券失败");
        });
    },

    // 每日领券
    receiveCoupon() {
      axios
        .post(
          "http://localhost:8082/fruit-backend/coupon/receive",
          {
            userId: this.userId
          }
        )
        .then(res => {
          alert(res.data.msg);
          this.loadCoupons();
        })
        .catch(() => {
          alert("领取失败");
        });
    },

    // 砸金蛋
    smashEgg() {
      axios
        .post(
          "http://localhost:8082/fruit-backend/egg/smash",
          {
            userId: this.userId
          }
        )
        .then(res => {
          alert(res.data.msg);
          this.loadCoupons();
        })
        .catch(() => {
          alert("砸蛋失败");
        });
    },

    formatTime(time) {
      if (!time) return "";

      return time.replace("T", " ");
    }
  }
};
</script>

<style scoped>

.activity-page {
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
}

.title {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0,0,0,.08);
}

.card h3 {
  margin-bottom: 10px;
}

.desc {
  color: #666;
  margin-bottom: 15px;
}

.btn {
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  color: white;
  font-size: 14px;
}

.receive-btn {
  background: #ff9800;
}

.receive-btn:hover {
  background: #f57c00;
}

.egg-btn {
  background: #e91e63;
}

.egg-btn:hover {
  background: #d81b60;
}

.empty {
  text-align: center;
  color: #999;
  padding: 20px;
}

.coupon-item {
  display: flex;
  align-items: center;
  margin-top: 12px;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #eee;
}

.coupon-left {
  width: 120px;
  background: #ff5722;
  color: white;
  text-align: center;
  padding: 15px;
}

.money {
  font-size: 24px;
  font-weight: bold;
}

.coupon-right {
  flex: 1;
  padding: 15px;
}

.coupon-right p {
  margin: 0;
  font-size: 16px;
}

.coupon-right small {
  color: #999;
}

@media (max-width: 768px) {

  .activity-page {
    padding: 10px;
  }

  .coupon-left {
    width: 90px;
  }

  .money {
    font-size: 18px;
  }

}
</style>