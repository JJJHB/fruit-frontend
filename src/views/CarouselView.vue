<template>
  <div class="view-card">
    <h2>轮播图管理</h2>
    <p>在这里可以管理水果分类，新增、编辑或删除分类。</p>
  </div>
</template>

<script>
export default {
  name: 'FruitCategoryView'
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
