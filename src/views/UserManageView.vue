<template>
  <div class="view-card">
    <h2>用户管理</h2>
    <form class="form-grid">
      <label>
        用户名
        <input type="text" placeholder="输入用户名" />
      </label>
      <label>
        角色
        <select>
          <option>管理员</option>
          <option>普通用户</option>
        </select>
      </label>
      <label>
        密码
        <input type="password" placeholder="输入密码" />
      </label>
      <label>
        状态
        <select>
          <option>正常</option>
          <option>禁用</option>
        </select>
      </label>
      <div class="action-row">
        <button type="button">保存用户</button>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'UserManageView'
}
</script>

<style scoped>
.view-card {
  padding: 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(16, 39, 80, 0.08);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

label {
  display: flex;
  flex-direction: column;
  font-weight: 600;
  color: #4a5568;
}

input,
select {
  margin-top: 8px;
  padding: 10px 12px;
  border: 1px solid #d2d6dc;
  border-radius: 8px;
  background: #f8fafc;
}

.action-row {
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
}

button {
  padding: 10px 18px;
  border: none;
  border-radius: 8px;
  background: #38a169;
  color: #fff;
  cursor: pointer;
}
</style>
