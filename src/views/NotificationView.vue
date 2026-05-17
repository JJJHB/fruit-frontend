<template>
  <div class="view-card">
    <h2>通知公告</h2>
    <ul class="notification-list">
      <li>系统已上线，请及时维护水果分类信息。</li>
      <li>新促销活动已经发布：满100减20。</li>
      <li>请在周末前完成订单数据核对。</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'NotificationView'
}
</script>

<style scoped>
.view-card {
  padding: 24px;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 12px 24px rgba(16, 39, 80, 0.08);
}

.notification-list {
  margin: 0;
  padding: 0;
  list-style: none;
  color: #334155;
}

.notification-list li {
  margin: 12px 0;
  padding-left: 10px;
  position: relative;
}

.notification-list li::before {
  content: '•';
  color: #38a169;
  position: absolute;
  left: 0;
}
</style>
