<template>
  <div class="view-card">
    <h2>订单查询与管理</h2>
    <p>查看订单状态、搜索订单号并管理订单流程。</p>
  </div>
</template>

<script>
export default {
  name: 'OrderQueryView'
}
</script>

<style scoped>
.view-card {
  padding: 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(16, 39, 80, 0.08);
}

h2 {
  margin-bottom: 12px;
}

p {
  color: #4a5568;
}
</style>
