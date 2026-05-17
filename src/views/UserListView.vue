<template>
  <div class="view-card">
    <h2>用户列表</h2>
    <table class="info-table">
      <thead>
        <tr>
          <th>用户名</th>
          <th>角色</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>admin</td>
          <td>管理员</td>
          <td>正常</td>
          <td>编辑 / 删除</td>
        </tr>
        <tr>
          <td>user01</td>
          <td>普通用户</td>
          <td>正常</td>
          <td>编辑 / 删除</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'UserListView'
}
</script>

<style scoped>
.view-card {
  padding: 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(16, 39, 80, 0.08);
}

.info-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
}

.info-table th,
.info-table td {
  padding: 14px 12px;
  text-align: left;
  border-bottom: 1px solid #edf2f7;
}

.info-table th {
  color: #4a5568;
  font-weight: 700;
}

td {
  color: #2d3748;
}
</style>
