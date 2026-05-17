<template>
  <div class="home-view">
    <header class="home-header">
      <div>
        <h1>系统首页</h1>
        <p>欢迎来到水果销售管理系统</p>
      </div>
    </header>

    <section class="home-cards">
      <article class="card">
        <h3>用户管理</h3>
        <p>查看用户列表，编辑管理员和普通用户。</p>
      </article>
      <article class="card">
        <h3>水果分类</h3>
        <p>维护水果分类，保证商品结构清晰。</p>
      </article>
      <article class="card">
        <h3>水果信息</h3>
        <p>添加、修改、删除水果产品信息。</p>
      </article>
      <article class="card">
        <h3>促销活动</h3>
        <p>管理当前促销计划，提高销售转化。</p>
      </article>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.home-view {
  padding: 24px;
}

.home-header {
  padding: 24px;
  border-radius: 16px;
  background: linear-gradient(135deg, #50a3ff 0%, #70d2ff 100%);
  color: #fff;
  margin-bottom: 24px;
}

.home-header h1 {
  margin: 0;
  font-size: 28px;
}

.home-header p {
  margin: 8px 0 0;
  color: rgba(255,255,255,0.9);
}

.home-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}

.card {
  padding: 20px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 14px 30px rgba(0, 0, 0, 0.05);
}

.card h3 {
  margin: 0 0 12px;
  color: #1f2d55;
}

.card p {
  margin: 0;
  color: #52606d;
}
</style>
