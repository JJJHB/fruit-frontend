<template>
  <div class="login-page">
    <div class="login-box">
      <h2>登录</h2>
      <form class="login-form">
        <label>
          用户名
          <input type="text" placeholder="请输入用户名" />
        </label>
        <label>
          密码
          <input type="password" placeholder="请输入密码" />
        </label>
        <button type="button">登录</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyLogin'
}
</script>

<style scoped>
.login-page {
  min-height: calc(100vh - 40px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #f3f6fb;
}

.login-box {
  width: min(420px, 100%);
  padding: 32px;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 18px 40px rgba(32, 62, 110, 0.1);
}

.login-box h2 {
  margin-bottom: 24px;
}

.login-form {
  display: grid;
  gap: 18px;
}

label {
  display: grid;
  gap: 8px;
  color: #4a5568;
  font-weight: 600;
}

input {
  padding: 12px 14px;
  border: 1px solid #dfe4ef;
  border-radius: 12px;
}

button {
  padding: 12px 18px;
  border: none;
  border-radius: 12px;
  background: #3b82f6;
  color: #fff;
  cursor: pointer;
}
</style>
