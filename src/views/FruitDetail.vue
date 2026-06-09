<template>
  <div class="detail-page">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <router-link to="/">首页</router-link>
      <span>/</span>
      <span>商品详情</span>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-tip">
      <div class="loading-spin"></div>
      <p>商品加载中...</p>
    </div>

    <div v-else class="detail-main">
      <!-- 左侧图片区域 -->
      <div class="detail-left">
        <div class="main-img">
          <img 
            :src="currentImg" 
            :alt="fruit.name"
            loading="lazy"
          />
        </div>
        <!-- 缩略图切换 -->
        <div class="thumb-list">
          <div 
            class="thumb-item" 
            :class="{ active: currentImg === thumb }"
            v-for="(thumb, index) in imgList" 
            :key="index"
            @click="switchImg(thumb)"
          >
            <img :src="thumb" :alt="`缩略图${index+1}`" loading="lazy" />
          </div>
        </div>
      </div>

      <!-- 右侧信息区域 -->
      <div class="detail-right">
        <h1 class="title">{{ fruit.name }}</h1>
        <p class="category">
          <i>📂</i> 分类：{{ fruit.categoryName || '暂无分类' }}
        </p>

        <div class="price-box">
          <span class="current-price">￥{{ fruit.price }}<small>/kg</small></span>
          <span class="original-price">￥{{ (fruit.price * 1.2).toFixed(2) }}/kg</span>
          <span class="discount-tag">限时特惠</span>
        </div>

        <div class="info-wrap">
          <div class="info-item">
            <span class="label">📦 库存</span>
            <span class="value">{{ fruit.stock || 0 }} 件</span>
          </div>
          <div class="info-item">
            <span class="label">👀 浏览</span>
            <span class="value">{{ fruit.clicknum || 0 }} 次</span>
          </div>
        </div>

        <div class="buy-area">
          <div class="num-select">
            <button @click="buyNum--" :disabled="buyNum <= 1">-</button>
            <input type="number" v-model="buyNum" min="1" readonly />
            <button @click="buyNum++" :disabled="buyNum >= fruit.stock">+</button>
          </div>
          <button class="add-cart-btn" @click="addToCart">加入购物车</button>
        </div>
      </div>
    </div>

    <!-- 标签页切换 -->
    <div class="tabs">
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'detail' }"
        @click="activeTab = 'detail'"
      >
        商品详情
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'comment' }"
        @click="activeTab = 'comment'"
      >
        买家评价
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'delivery' }"
        @click="activeTab = 'delivery'"
      >
        配送说明
      </div>
    </div>

    <!-- 标签页内容 -->
    <div class="detail-content">
      <template v-if="activeTab === 'detail'">
        <h3>📝 商品简介</h3>
        <p>{{ fruit.detail || '新鲜直达，产地直供，果肉饱满，甜蜜多汁，精选优质鲜果，每日新鲜发货。' }}</p>
      </template>
      <template v-else-if="activeTab === 'comment'">
        <h3>💬 买家评价</h3>
        <div class="empty-comment">
          <p>暂无评价，快来抢沙发吧~</p>
        </div>
      </template>
      <template v-else-if="activeTab === 'delivery'">
        <h3>🚚 配送说明</h3>
        <p>支持全国大部分地区常温/冷链配送，新鲜保鲜。偏远地区请联系客服确认配送范围。生鲜水果下单后48小时内发出，不支持无理由退货哦。</p>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const baseURL = 'http://localhost:8082/fruit-backend'
const route = useRoute()

const loading = ref(true)
const fruit = ref({})
const buyNum = ref(1)
const activeTab = ref('detail')

// 图片列表
const imgList = ref([])
const currentImg = ref('')

// 获取商品详情数据
const getFruitDetail = async () => {
  const id = route.params.id
  try {
    const res = await axios.get(`${baseURL}/fruitQueryList`)
    const list = res.data.fruits || []
    const data = list.find(item => item.id === Number(id)) || {}
    fruit.value = data

    const mainImg = data.picture 
      ? `${baseURL}/upload/${data.picture}` 
      : 'https://via.placeholder.com/400'
    imgList.value = [mainImg]
    currentImg.value = mainImg
  } catch (err) {
    console.error('获取商品详情失败', err)
  } finally {
    loading.value = false
  }
}

// 切换主图
const switchImg = (url) => {
  currentImg.value = url
}

// 加入购物车
const addToCart = () => {
  if (buyNum.value > fruit.value.stock) {
    alert('库存不足，无法购买！')
    return
  }
  alert(`${fruit.value.name} 已加入购物车 x${buyNum.value}`)
}

onMounted(() => {
  getFruitDetail()
})
</script>

<style scoped>
/* 全局基础 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.detail-page {
  width: 1200px;
  margin: 80px auto 40px;
  padding: 0 20px;
  background-color: #f5f6f7;
}

/* 面包屑导航 */
.breadcrumb {
  font-size: 14px;
  color: #888;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.breadcrumb a {
  color: #409eff;
  text-decoration: none;
  transition: color 0.2s;
}
.breadcrumb a:hover {
  color: #27ae60;
}

/* 加载动画 */
.loading-tip {
  text-align: center;
  padding: 120px 0;
  color: #666;
}
.loading-spin {
  width: 40px;
  height: 40px;
  margin: 0 auto 12px;
  border: 4px solid #e8e8e8;
  border-top: 4px solid #27ae60;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 主内容区域 */
.detail-main {
  display: flex;
  gap: 50px;
  background: #fff;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 30px;
}

/* 左侧图片区 */
.detail-left {
  width: 420px;
}
.main-img {
  border-radius: 12px;
  overflow: hidden;
  background: #f8f9fa;
}
.main-img img {
  width: 100%;
  height: 420px;
  object-fit: cover;
  transition: transform 0.3s ease;
}
.main-img img:hover {
  transform: scale(1.03);
}

.thumb-list {
  display: flex;
  gap: 12px;
  margin-top: 15px;
}
.thumb-item {
  width: 70px;
  height: 70px;
  border: 2px solid transparent;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background: #f8f9fa;
  transition: all 0.2s;
}
.thumb-item.active {
  border-color: #27ae60;
  box-shadow: 0 0 0 2px rgba(39, 174, 96, 0.2);
}
.thumb-item:hover {
  border-color: #ccc;
}
.thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 右侧信息区 */
.detail-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.title {
  font-size: 26px;
  color: #222;
  font-weight: 600;
  margin-bottom: 12px;
  line-height: 1.4;
}
.category {
  font-size: 14px;
  color: #777;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 价格区域 */
.price-box {
  display: flex;
  align-items: baseline;
  gap: 16px;
  padding: 16px 20px;
  background: #fff5f5;
  border-radius: 12px;
  margin-bottom: 24px;
}
.current-price {
  font-size: 34px;
  color: #e74c3c;
  font-weight: bold;
}
.current-price small {
  font-size: 16px;
  font-weight: normal;
}
.original-price {
  font-size: 15px;
  color: #aaa;
  text-decoration: line-through;
}
.discount-tag {
  padding: 4px 10px;
  background: #e74c3c;
  color: #fff;
  font-size: 12px;
  border-radius: 20px;
}

/* 信息行 */
.info-wrap {
  display: flex;
  gap: 40px;
  margin-bottom: 30px;
}
.info-item {
  font-size: 15px;
  color: #444;
}
.info-item .label {
  color: #888;
  margin-right: 8px;
}

/* 购买数量 & 按钮 */
.buy-area {
  display: flex;
  align-items: center;
  gap: 24px;
}
.num-select {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
}
.num-select button {
  width: 36px;
  height: 36px;
  border: none;
  background: #f5f5f5;
  font-size: 18px;
  cursor: pointer;
  transition: background 0.2s;
}
.num-select button:hover:not(:disabled) {
  background: #e8e8e8;
}
.num-select button:disabled {
  background: #f9f9f9;
  color: #ccc;
  cursor: not-allowed;
}
.num-select input {
  width: 60px;
  height: 36px;
  border: none;
  text-align: center;
  outline: none;
  font-size: 15px;
}

.add-cart-btn {
  padding: 10px 36px;
  background: #27ae60;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 10px rgba(39, 174, 96, 0.25);
}
.add-cart-btn:hover {
  background: #219653;
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(39, 174, 96, 0.3);
}

/* 标签页 */
.tabs {
  display: flex;
  background: #fff;
  border-radius: 16px 16px 0 0;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
}
.tab-item {
  padding: 18px 32px;
  cursor: pointer;
  font-size: 15px;
  color: #666;
  position: relative;
  transition: color 0.2s;
}
.tab-item:hover {
  color: #27ae60;
}
.tab-item.active {
  color: #27ae60;
  font-weight: 500;
}
.tab-item.active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3px;
  background: #27ae60;
}

/* 标签内容区 */
.detail-content {
  background: #fff;
  padding: 30px;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
  margin-bottom: 40px;
}
.detail-content h3 {
  font-size: 18px;
  color: #333;
  margin-bottom: 16px;
  padding-left: 8px;
  border-left: 4px solid #27ae60;
}
.detail-content p {
  color: #666;
  line-height: 2;
  font-size: 15px;
}
.empty-comment {
  text-align: center;
  padding: 60px 0;
  color: #999;
  font-size: 15px;
}

/* 响应式适配 */
@media (max-width: 1200px) {
  .detail-page {
    width: 100%;
  }
  .detail-main {
    flex-direction: column;
  }
  .detail-left {
    width: 100%;
  }
}
</style>