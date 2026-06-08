<template>
  <div class="search-page">
    <div style="margin-bottom:12px">
      <button @click="$router.push('/')" style="padding:5px 12px;border:none;background:#ccc;border-radius:6px;cursor:pointer">← 返回首页</button>
    </div>
    <!-- 搜索框 -->
    <div class="search-box">
      <input
        v-model="keyword"
        type="text"
        placeholder="搜索水果..."
        @keyup.enter="doSearch"
      />
      <button @click="doSearch">搜索</button>
    </div>

    <!-- 搜索结果 -->
    <div class="result">
      <h2 v-if="keyword">搜索结果：{{ keyword }}</h2>
      <p v-else>全部水果</p>

      <div class="fruit-list">
        <div class="fruit-card" v-for="f in filteredFruits" :key="f.id">
          <img :src="f.picture ? `${baseURL}/upload/${f.picture}` : defaultImg" />
          <h3>{{ f.name }}</h3>
          <p class="price">￥{{ f.price }}</p>
          <p class="desc">{{ f.detail }}</p>
        </div>

        <p v-if="filteredFruits.length === 0 && keyword">没有找到相关水果 😢</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "SearchView",
  data() {
    return {
      baseURL: "http://localhost:8082/fruit-backend",
      keyword: "",
      defaultImg: "https://picsum.photos/200/150",
      fruitList: []
    };
  },
  computed: {
    filteredFruits() {
      return this.fruitList
    }
  },
  mounted() {
    this.keyword = this.$route.query.keyword || ""
    // 无论空还是有值，都请求数据（空=查全部）
    this.getSearchData()
  },
  watch: {
    "$route.query.keyword"(val) {
      this.keyword = val || ""
      this.getSearchData()
    },
    // 输入框内容实时变化，自动搜索
    keyword() {
      this.getSearchData()
    }
  },
  
  methods: {
    async getSearchData(){
      try {
        let res = await axios.get(`${this.baseURL}/fruitQueryList`,{
          params:{
            name:this.keyword,
            minPrice:"",
            maxPrice:""
          }
        })
        this.fruitList = res.data.fruits || []
      }catch(err){
        console.error(err)
        this.fruitList = []
      }
    },
    doSearch() {
      let key = this.keyword.trim()
      // 空值不带参数，页面显示全部
      if (!key) {
        this.$router.push({ path: "/search" });
        return;
      }
      // 有值携带关键词搜索
      this.$router.push({ path: "/search", query: { keyword: key } });
    }
  }
};
</script>

<style scoped>
.search-page {
  width: 1200px;
  margin: 20px auto;
  font-family: Arial, Helvetica, sans-serif;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
}

.search-box input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  outline: none;
}

.search-box button {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  background: #2ecc71;
  color: #fff;
  cursor: pointer;
}

.search-box button:hover {
  background: #27ae60;
}

.fruit-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.fruit-card {
  background: #fff;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  text-align: center;
}

.fruit-card img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.fruit-card h3 {
  font-size: 16px;
  margin: 8px 0;
}

.price {
  color: #e74c3c;
  font-weight: bold;
}

.desc {
  font-size: 12px;
  color: #666;
}
</style>