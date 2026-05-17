<template>
  <div class="view-card">
    <h2>个人中心</h2>
    <section class="profile-section">
      <dl>
        <dt>用户名</dt>
        <dd>admin</dd>
        <dt>角色</dt>
        <dd>管理员</dd>
        <dt>上次登录地址</dt>
        <dd>保定</dd>
        <dt>上次登录时间</dt>
        <dd>2026-05-17 15:14:33</dd>
      </dl>
    </section>
  </div>
</template>

<script>
export default {
  name: 'UserProfileView'
}
</script>

<style scoped>
.view-card {
  padding: 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(16, 39, 80, 0.08);
}

.profile-section dl {
  display: grid;
  grid-template-columns: 120px 1fr;
  row-gap: 12px;
  column-gap: 16px;
}

dt {
  color: #6b7a93;
  font-weight: 600;
}

dd {
  margin: 0;
  color: #23354a;
}
</style>
