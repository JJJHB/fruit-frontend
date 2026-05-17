<template>
  <div class="view-card">
    <h2>促销活动管理</h2>
    <p>显示当前进行中的促销活动，并支持新增、编辑、结束活动。</p>
  </div>
</template>

<script>
export default {
  name: 'PromotionView'
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
