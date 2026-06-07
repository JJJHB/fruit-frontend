<template>
  <div class="login-page">
    <div class="login-box">

      <h2>登录</h2>

      <form class="login-form">

        <label>
          用户名
          <input
            v-model="username"
            type="text"
            placeholder="请输入用户名"
          />
        </label>

        <label>
          密码
          <input
            v-model="password"
            type="password"
            placeholder="请输入密码"
          />
        </label>

        <button
          type="button"
          @click="login"
        >
          登录
        </button>

        <div class="bottom-area">

          <router-link
            to="/register"
            class="register-link"
          >
            注册账号
          </router-link>

          <select v-model="role">
            <option value="user">
              用户
            </option>

            <option value="admin">
              管理员
            </option>
          </select>

        </div>

      </form>

    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MyLogin",

  data() {
    return {
      role: "user",         // 默认用户
      username: "zhangsan", // 默认账号
      password: "123456"    // 默认密码
    }
  },

  watch: {
    role(newRole) {
      if (newRole === "admin") {
        this.username = "admin1";
        this.password = "123456";
      } else {
        this.username = "zhangsan";
        this.password = "123456";
      }
    }
  },

  methods: {
    login() {

      const params = new URLSearchParams();

      params.append("username", this.username);
      params.append("password", this.password);
      params.append("role", this.role);

      axios.post(
        "http://localhost:8082/fruit-backend/login",
        params
      ).then(res => {

        const data = res.data;

        if (data.code === 200) {

          if (data.role === "admin") {
            this.$router.push("/admin");
          } else {
            this.$router.push("/");
          }

        } else {
          alert(data.msg);
        }

      });

    }
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f5f7fa;
}

.login-box {
  width: 420px;
  padding: 30px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0,0,0,.1);
}

h2 {
  text-align: center;
  margin-bottom: 25px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

input {
  width: 100%;
  padding: 10px;
  margin-top: 5px;
  border: 1px solid #ddd;
  border-radius: 6px;
}

button {
  padding: 12px;
  border: none;
  border-radius: 6px;
  background: #409eff;
  color: white;
  cursor: pointer;
}

.bottom-area {
  margin-top: 10px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.register-link {
  text-decoration: none;
  color: #409eff;
}

select {
  width: 100px;
  padding: 6px;
  border: 1px solid #ddd;
  border-radius: 5px;
}
</style>