<template>
  <div class="order-page">

    <h2 class="title">📦 我的订单</h2>

    <div class="tabs">
      <span
        v-for="tab in tabs"
        :key="tab"
        :class="{active:currentTab===tab}"
        @click="currentTab=tab"
      >
        {{ tab }}
      </span>
    </div>

    <div v-if="filteredOrders.length===0" class="empty">
      暂无订单
    </div>

    <div v-else>

      <div
        class="order-card"
        v-for="order in filteredOrders"
        :key="order.id"
      >

        <div class="order-header">
          <span>订单号：{{ order.id }}</span>

          <span
            class="status"
            :class="statusClass(order.status)"
          >
            {{ order.status }}
          </span>
        </div>

        <div class="order-body">

          <img
            :src="order.image"
            class="img"
          >

          <div class="info">

            <div class="name">
              {{ order.name }}
            </div>

            <div>
              单价：￥{{ Number(order.price).toFixed(2) }}
            </div>

            <div>
              数量：{{ order.quantity }}
            </div>

            <div class="total">
              ￥{{ Number(order.totalPrice).toFixed(2) }}
            </div>

          </div>

          <div class="action">
            <button
              v-if="order.status==='待支付'"
              class="pay-btn"
              @click="payOrder(order)"
            >
              去支付
            </button>

            <button
              v-else-if="order.status==='已发货'"
              class="finish-btn"
              @click="finishOrder(order)"
            >
              确认收货
            </button>
          </div>

        </div>

      </div>

    </div>

  </div>
</template>

<script>
import axios from "axios"

export default {
  name:"OrderView",

  data(){
    return{
      orders:[],
      fruits:[],
      tabs:[
        "全部",
        "待支付",
        "已支付",
        "待发货",
        "已发货",
        "已完成"
      ],
      currentTab:"全部"
    }
  },

  computed:{
    filteredOrders(){
      if(this.currentTab==="全部"){
        return this.orders
      }
      return this.orders.filter(o=>o.status===this.currentTab)
    }
  },

  mounted(){
    this.loadData()
  },

  methods:{
    async loadData(){
      const user = JSON.parse(localStorage.getItem("user"))
      const fruitRes = await axios.get("http://localhost:8082/fruit-backend/fruitQueryList")
      this.fruits = fruitRes.data.fruits || []

      const orderRes = await axios.get("http://localhost:8082/fruit-backend/orders", {
        params:{ userId:user.id }
      })

      this.orders = orderRes.data.map(order=>{
        const fruit = this.fruits.find(f=>f.id==order.fruitId)
        return {
          ...order,
          name: fruit?.name || "未知商品",
          image: fruit?.picture ? "http://localhost:8082/fruit-backend/upload/"+fruit.picture : "",
          quantity: order.quantity,
          price: order.price,
          totalPrice: order.totalPrice
        }
      })
    },

    statusClass(status){
      switch(status){
        case "待支付": return "waitPay"
        case "已支付": return "paid"
        case "待发货": return "waitSend"
        case "已发货": return "sent"
        case "已完成": return "finish"
        default: return ""
      }
    },

    async payOrder(order){
      const res = await axios.post("http://localhost:8082/fruit-backend/orders", null, {
        params:{ action:"pay", id:order.id }
      })

      if(res.data.success){
        alert("支付成功")
        const user = JSON.parse(localStorage.getItem("user"))
        user.money = Number(user.money) - Number(order.totalPrice)
        localStorage.setItem("user", JSON.stringify(user))
        this.loadData()
      }else{
        alert(res.data.msg)
      }
    },

    async finishOrder(order){
      const res = await axios.post("http://localhost:8082/fruit-backend/orders", null, {
        params:{ action:"finish", id:order.id }
      })

      if(res.data.success){
        alert("收货成功")
        this.loadData()
      }else{
        alert("操作失败")
      }
    }
  }
}
</script>

<style scoped>
.order-page{
  max-width:900px;
  margin:auto;
  padding:20px;
}

.title{
  text-align:center;
  margin-bottom:20px;
}

.tabs{
  display:flex;
  gap:10px;
  margin-bottom:20px;
  flex-wrap:wrap;
}

.tabs span{
  padding:8px 15px;
  background:#eee;
  border-radius:20px;
  cursor:pointer;
}

.tabs span.active{
  background:#4caf50;
  color:white;
}

.order-card{
  background:white;
  border-radius:10px;
  padding:15px;
  margin-bottom:15px;
  box-shadow:0 2px 8px rgba(0,0,0,.1);
}

.order-header{
  display:flex;
  justify-content:space-between;
  margin-bottom:15px;
}

.order-body{
  display:flex;
  align-items:flex-start;
  gap:15px;
  flex-wrap:wrap;
}

.img{
  width:80px;
  height:80px;
  border-radius:10px;
  flex-shrink:0;
}

.info{
  flex:1 1 200px;
}

.action{
  margin-left:auto; /* 按钮固定右侧 */
  display:flex;
  align-items:center;
  gap:10px;
}

.pay-btn,
.finish-btn{
  width:100px;
  height:36px;
  border:none;
  color:white;
  border-radius:6px;
  cursor:pointer;
}

.pay-btn{ background:#ff9800; }
.finish-btn{ background:#4caf50; }

.status{
  color:white;
  padding:3px 10px;
  border-radius:20px;
}

.waitPay{ background:#ff9800; }
.paid{ background:#4caf50; }
.waitSend{ background:#2196f3; }
.sent{ background:#673ab7; }
.finish{ background:#999; }

.empty{
  text-align:center;
  margin-top:50px;
  color:#888;
}

@media (max-width:500px){
  .order-body{
    flex-direction:column;
    align-items:flex-start;
  }
  .action{
    margin-left:0;
    margin-top:10px;
    width:100%;
    justify-content:flex-start;
  }
}
</style>