<template>
  <div class="promotion-page">

    <!-- 页面顶部导航占位 -->
    <div class="nav-placeholder"></div>

    <!-- 标题 -->
    <div class="header">
      <h2>限时促销活动</h2>
      <p class="sub">精选水果限时折扣，错过再等一年 🍓</p>
    </div>

    <!-- 活动卡片 -->
    <el-row :gutter="20">
      <el-col
        v-for="item in promotions"
        :key="item.id"
        :span="6"
      >
        <el-card shadow="hover" class="promo-card">

          <!-- 水果图片 -->
          <div class="img-box">
            <img :src="item.img" />
          </div>

          <!-- 内容 -->
          <div class="content">
            <h3 class="title">{{ item.title }}</h3>
            <p class="fruit-name">🍎 {{ item.fruitName }}</p>
            <p class="price">
              <span class="discount">￥{{ item.discount_price }}</span>
              <span class="tag">特惠价</span>
            </p>
            <p class="time">
              ⏰ {{ item.start_time }} ~ {{ item.end_time }}
            </p>
            <el-button type="danger" size="small">
              立即抢购
            </el-button>
          </div>

        </el-card>
      </el-col>
    </el-row>

  </div>
</template>

<script setup>
import { ref } from "vue"

/** 🚨 静态假数据（模拟数据库 cuxiaohuodong） */
const promotions = ref([
  { id: 1, fruit_id: 101, fruitName: "红富士苹果", title: "夏季清凉特惠", discount_price: 5.99, start_time: "2026-06-01 10:00", end_time: "2026-06-10 22:00", img: "https://images.unsplash.com/photo-1567306226416-28f0efdc88ce" },
  { id: 2, fruit_id: 102, fruitName: "海南芒果", title: "芒果狂欢节", discount_price: 8.50, start_time: "2026-06-03 10:00", end_time: "2026-06-12 22:00", img: "https://images.unsplash.com/photo-1553279768-865429fa0078" },
  { id: 3, fruit_id: 103, fruitName: "进口葡萄", title: "酸甜爆汁特价", discount_price: 12.00, start_time: "2026-06-05 10:00", end_time: "2026-06-15 22:00", img: "https://images.unsplash.com/photo-1537640538966-79f369143f8f" },
  { id: 4, fruit_id: 104, fruitName: "水蜜桃", title: "夏日限定优惠", discount_price: 6.80, start_time: "2026-06-06 10:00", end_time: "2026-06-16 22:00", img: "https://images.unsplash.com/photo-1591073113125-e46713c829ed" },
  { id: 5, fruit_id: 105, fruitName: "泰国榴莲", title: "榴莲爱好者狂欢", discount_price: 39.90, start_time: "2026-06-01 09:00", end_time: "2026-06-20 22:00", img: "https://images.unsplash.com/photo-1621961458348-f013d219b50c" },
  { id: 6, fruit_id: 106, fruitName: "阳光橙", title: "维C补给计划", discount_price: 4.99, start_time: "2026-06-02 08:00", end_time: "2026-06-18 22:00", img: "https://images.unsplash.com/photo-1547514701-42782101795e" },
  { id: 7, fruit_id: 107, fruitName: "蓝莓", title: "护眼特惠季", discount_price: 15.50, start_time: "2026-06-03 10:00", end_time: "2026-06-25 22:00", img: "https://images.unsplash.com/photo-1498557850523-fd3d118b962e" },
  { id: 8, fruit_id: 108, fruitName: "火龙果", title: "红心爆汁特价", discount_price: 7.20, start_time: "2026-06-04 10:00", end_time: "2026-06-22 22:00", img: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc" },
  { id: 9, fruit_id: 109, fruitName: "牛油果", title: "健康轻食推荐", discount_price: 9.90, start_time: "2026-06-05 10:00", end_time: "2026-06-30 22:00", img: "https://images.unsplash.com/photo-1589927986089-35812388d1f4" },
  { id: 10, fruit_id: 110, fruitName: "草莓", title: "少女心爆棚特惠", discount_price: 11.80, start_time: "2026-06-06 10:00", end_time: "2026-06-28 22:00", img: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6" }
])
</script>

<style scoped>
/* 给导航栏预留空间 */
.nav-placeholder {
  height: 60px; /* 根据实际导航栏高度调整 */
}

/* 页面整体 */
.promotion-page {
  padding: 20px;
}

/* 标题区 */
.header {
  margin-bottom: 20px;
}
.header h2 { margin: 0; }
.sub { color: #888; font-size: 13px; }

/* 卡片样式 */
.promo-card {
  border-radius: 12px;
  overflow: hidden;
  transition: 0.3s;
}
.promo-card:hover { transform: translateY(-4px); }

/* 图片 */
.img-box img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 8px;
}

/* 内容 */
.content { padding: 10px 0; }
.title { font-size: 16px; margin: 5px 0; }
.fruit-name { color: #666; font-size: 13px; }
.price { margin: 8px 0; }
.discount { color: #e74c3c; font-size: 18px; font-weight: bold; }
.tag { margin-left: 8px; font-size: 12px; color: white; background: #e74c3c; padding: 2px 6px; border-radius: 4px; }
.time { font-size: 12px; color: #999; margin-bottom: 10px; }

/* 卡片间距 */
.el-col { margin-bottom: 20px; }
</style>