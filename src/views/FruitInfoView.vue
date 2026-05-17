<template>
  <div class="view-card">
    <h2>水果信息管理</h2>
    <p>添加、修改和删除水果信息，包含名称、价格、库存等基本字段。</p>
  </div>
</template>

<script>
export default {
  name: 'FruitInfoView'
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
