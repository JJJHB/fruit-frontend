<template>
  <div class="profile-page">

    <!-- 用户信息 -->
    <div class="card user-card">
      <img :src="user.picture || defaultAvatar" class="avatar" />

      <div class="info">
        <h2>{{ user.username }}</h2>
        <p>性别：{{ user.sex || '未填写' }}</p>
        <p>手机号：{{ user.phone || '未填写' }}</p>
        <p class="money">余额：¥{{ user.money }}</p>
      </div>
    </div>

    <!-- 地址管理 -->
    <div class="card">
      <div class="header">
        <h3>📍 收货地址</h3>
        <button class="add-btn" @click="openAdd">新增地址</button>
      </div>

      <div v-if="addressList.length === 0" class="empty">
        暂无收货地址
      </div>

      <div v-for="item in sortedAddressList" :key="item.id" class="address-item">
        <div class="left">
          <div class="top">
            <b>{{ item.recipient }}</b>
            <span>{{ item.phone }}</span>
            <span v-if="item.is_default == 1 || item.is_default == '1'" class="tag">默认</span>
          </div>
          <div class="detail">{{ item.detail }}</div>
        </div>

        <div class="right">
            <button v-if="item.is_default != 1 && item.is_default != '1'"
                @click="setDefault(item.id)">设为默认
            </button>
          <button class="edit" @click="openEdit(item)">编辑</button>
          <button class="del" @click="deleteAddress(item.id)">删除</button>
        </div>
      </div>
    </div>

    <!-- 弹窗 -->
    <div v-if="showDialog" class="mask">
      <div class="dialog">
        <h3>{{ form.id ? '编辑地址' : '新增地址' }}</h3>
        <input v-model="form.recipient" placeholder="收件人" />
        <input v-model="form.phone" placeholder="手机号" />
        <textarea v-model="form.detail" placeholder="详细地址"></textarea>
        <div class="btns">
          <button @click="showDialog = false">取消</button>
          <button @click="saveAddress">保存</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ProfileView",
  data() {
    return {
      user: {},
      addressList: [],
      showDialog: false,
      form: { id: null, recipient: "", phone: "", detail: "" },
      defaultAvatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    };
  },

  computed: {
    // 默认地址排在最上方
    sortedAddressList() {
      return this.addressList.slice().sort((a, b) => b.is_default - a.is_default);
    }
  },

  mounted() {
    this.loadUser();
    this.loadAddress();
  },

  methods: {

    // ===== 用户信息（从缓存）=====
    loadUser() {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      console.log("用户信息:", user);
      this.user = user;
    },

    // ===== 地址列表 =====
    async loadAddress() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
        this.addressList = [];
        return;
    }

    try {
        const res = await axios.get(
        "http://localhost:8082/fruit-backend/address/list",
        { params: { userId: user.id } }
        );

        // 映射字段，把 isDefault -> is_default
        this.addressList = (res.data || []).map(item => ({
        ...item,
        is_default: Number(item.isDefault) // 确保是数字 0 / 1
        }));
    } catch (err) {
        console.error("加载地址失败:", err);
        this.addressList = [];
    }
    },

    // ===== 新增 =====
    openAdd() {
      this.form = { id: null, recipient: "", phone: "", detail: "" };
      this.showDialog = true;
    },

    // ===== 编辑 =====
    openEdit(item) {
      this.form = { ...item };
      this.showDialog = true;
    },

    // ===== 保存（新增 / 修改）=====
    async saveAddress() {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.id) {
        alert("用户未登录，无法保存地址");
        return;
    }

    const url = this.form.id
        ? "http://localhost:8082/fruit-backend/address/update"
        : "http://localhost:8082/fruit-backend/address/add";

    const payload = { ...this.form, userId: user.id };

    try {
        await axios.post(url, payload);
        this.showDialog = false;
        this.loadAddress(); // 刷新列表
        // 去掉 alert
    } catch (err) {
        console.error("保存地址失败:", err);
    }
    },

    // ===== 删除 =====
    async deleteAddress(id) {
      if (!confirm("确定删除该地址吗？")) return;

      try {
        await axios.get(
          "http://localhost:8082/fruit-backend/address/delete",
          { params: { id } }
        );
        this.loadAddress();
      } catch (err) {
        console.error("删除地址失败:", err);
      }
    },

    // ===== 设为默认 =====
    async setDefault(id) {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (!user.id) return;

        try {
            await axios.get(
            "http://localhost:8082/fruit-backend/address/default",
            { params: { id, userId: user.id } }
            );
            this.loadAddress(); // 刷新列表
            // 去掉 alert
        } catch (err) {
            console.error("设置默认地址失败:", err);
            alert("设置默认地址失败"); // 保留错误提示
        }
    }
  }
};
</script>

<style scoped>
.profile-page {
  max-width: 900px;
  margin: 20px auto;
  padding: 10px;
  padding-top: 80px;
}
.card {
  background: #fff;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}
.user-card {
  display: flex;
  gap: 20px;
  align-items: center;
}
.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.money {
  color: #ff6700;
  font-weight: bold;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.add-btn {
  background: #67c23a;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
}
.address-item {
  display: flex;
  justify-content: space-between;
  border: 1px solid #eee;
  padding: 12px;
  margin-top: 10px;
  border-radius: 8px;
}
.top {
  display: flex;
  gap: 10px;
  align-items: center;
}
.tag {
  background: red;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}
.right button {
  margin-left: 6px;
}
.edit {
  background: #409eff;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
}
.del {
  background: #f56c6c;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
}
.mask {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.dialog {
  width: 360px;
  background: white;
  padding: 20px;
  border-radius: 10px;
}
.dialog input,
.dialog textarea {
  width: 100%;
  margin: 8px 0;
  padding: 8px;
}
.btns {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>