<template>
  <div class="notification-container">
    <div class="page-header">
      <span>首页</span> <span class="separator">●</span> <span class="active">通知公告</span>
    </div>

    <div class="search-bar">
      <span class="search-label">标题</span>
      <el-input
          v-model="searchTitle"
          placeholder="标题"
          style="width: 200px; margin-right: 15px;"
          size="small"
          clearable>
      </el-input>
      <el-button type="success" size="small" @click="fetchNewsList" icon="el-icon-search">查询</el-button>

      <div class="action-buttons">
        <el-button type="success" plain size="small" @click="handleAdd">+ 添加</el-button>
        <el-button type="danger" plain size="small" @click="handleBatchDelete">删除</el-button>
      </div>
    </div>

    <el-table
        :data="newsList"
        border
        style="width: 100%; margin-top: 15px;"
        @selection-change="handleSelectionChange"
        :header-cell-style="{ background: '#333333', color: '#fff', textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }">

      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" label="序号" width="60"></el-table-column>

      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="typename" label="分类名称"></el-table-column>
      <el-table-column prop="name" label="发布人"></el-table-column>
      <el-table-column prop="clicknum" label="点击次数" width="100"></el-table-column>
      <el-table-column prop="storeupnum" label="收藏数" width="100"></el-table-column>

      <el-table-column label="图片" width="150">
        <template v-slot="scope">
          <img
              :src="getImgUrl(scope.row.picture)"
              style="width: 80px; height: 60px; object-fit: cover; border-radius: 4px;"
              alt="图片"
          />
        </template>
      </el-table-column>

      <el-table-column label="操作" width="240">
        <template v-slot="scope">
          <el-button size="mini" type="success" plain @click="handleView(scope.row)">+ 查看</el-button>
          <el-button size="mini" type="primary" plain @click="handleEdit(scope.row)">修改</el-button>
          <el-button size="mini" type="danger" plain @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="50%" @close="resetForm">
      <el-form :model="form" label-width="100px" size="small">
        <el-form-item label="公告标题">
          <el-input v-model="form.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="分类名称">
          <el-input v-model="form.typename" placeholder="请输入分类名称"></el-input>
        </el-form-item>
        <el-form-item label="发布人">
          <el-input v-model="form.name" placeholder="请输入发布人姓名"></el-input>
        </el-form-item>
        <el-form-item label="封面图片路径">
          <el-input v-model="form.picture" placeholder="可输入图片 URL 或相对路径"></el-input>
        </el-form-item>
        <el-form-item label="公告简介">
          <el-input type="textarea" :rows="2" v-model="form.introduction" placeholder="请输入简短介绍"></el-input>
        </el-form-item>
        <el-form-item label="详细内容">
          <el-input type="textarea" :rows="5" v-model="form.content" placeholder="请输入详细内容"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button size="small" @click="dialogVisible = false">取 消</el-button>
          <el-button size="small" type="success" @click="submitForm">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="公告详情查看" v-model="viewVisible" width="45%">
      <div class="view-detail">
        <h2>{{ viewData.title }}</h2>
        <div class="meta-info">
          <span>分类：{{ viewData.typename }}</span> |
          <span>发布人：{{ viewData.name }}</span> |
          <span>点击量：{{ viewData.clicknum }}</span>
        </div>
        <hr />
        <div class="img-box" v-if="viewData.picture" style="text-align:center; margin: 15px 0;">
          <img :src="getImgUrl(viewData.picture)" style="max-width: 100%; max-height: 250px; object-fit: contain;" />
        </div>
        <p class="intro-text"><b>简介：</b>{{ viewData.introduction || '暂无简介' }}</p>
        <div class="content-text">
          <b>详细内容：</b>
          <div style="margin-top: 10px; line-height: 1.6; text-indent: 2em;">{{ viewData.content }}</div>
        </div>
      </div>
      <template v-slot:footer>
        <div class="dialog-footer">
          <el-button size="small" type="primary" @click="viewVisible = false">确 定</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { ElMessage } from 'element-plus'; // 确保引入 Vue 3 的消息提示

export default {
  name: 'NotificationView',
  setup() {
    // 响应式变量定义
    const searchTitle = ref('');
    const newsList = ref([]);
    const multipleSelection = ref([]);

    const dialogVisible = ref(false);
    const viewVisible = ref(false);
    const dialogTitle = ref('添加公告');
    const isEdit = ref(false);

    const form = reactive({
      id: '',
      title: '',
      typename: '',
      name: '',
      picture: '',
      introduction: '',
      content: ''
    });

    const viewData = ref({});

    // 1. 获取数据列表
    const fetchNewsList = async () => {
      try {
        const res = await axios.get('http://localhost:8082/fruit-backend/NewsServlet', {
          params: {
            action: 'list',
            title: searchTitle.value
          }
        });
        newsList.value = res.data;
      } catch (error) {
        console.error("加载数据失败：", error);
      }
    };

    // 页面加载时执行
    onMounted(() => {
      fetchNewsList();
    });

    // 2. 点击添加
    const handleAdd = () => {
      isEdit.value = false;
      dialogTitle.value = '添加公告';
      dialogVisible.value = true; // 真正改变 ref 响应式状态
    };

    // 3. 点击修改
    const handleEdit = (row) => {
      isEdit.value = true;
      dialogTitle.value = '修改公告';
      // 填充 reactive 表单数据
      Object.assign(form, row);
      dialogVisible.value = true;
    };

    // 4. 提交表单
    const submitForm = async () => {
      if (!form.title || !form.content) {
        ElMessage.warning("标题和内容不能为空！");
        return;
      }
      const actionType = isEdit.value ? 'update' : 'add';
      try {
        const params = new URLSearchParams();
        params.append('action', actionType);
        if (isEdit.value) params.append('id', form.id);
        params.append('title', form.title);
        params.append('typename', form.typename);
        params.append('name', form.name);
        params.append('picture', form.picture);
        params.append('introduction', form.introduction);
        params.append('content', form.content);

        const res = await axios.post('http://localhost:8082/fruit-backend/NewsServlet', params);
        if (res.data.code === 200) {
          ElMessage.success(isEdit.value ? "修改成功" : "添加成功");
          dialogVisible.value = false;
          fetchNewsList();
        } else {
          ElMessage.error(res.data.msg || "操作失败");
        }
      } catch (error) {
        console.error("请求失败：", error);
      }
    };

    // 5. 点击查看
    const handleView = (row) => {
      viewData.value = row;
      viewVisible.value = true;
    };

    // 6. 单条删除
    const handleDelete = async (id) => {
      if (confirm("确定要删除该条公告吗？")) {
        try {
          const res = await axios.get('http://localhost:8082/fruit-backend/NewsServlet', {
            params: { action: 'delete', id: id }
          });
          if (res.data.code === 200) {
            ElMessage.success("删除成功");
            fetchNewsList();
          }
        } catch (error) {
          console.error("删除失败：", error);
        }
      }
    };

    // 7. 批量删除
    const handleBatchDelete = async () => {
      if (multipleSelection.value.length === 0) {
        ElMessage.warning("请选择要删除的公告");
        return;
      }
      if (confirm(`确定要删除这 ${multipleSelection.value.length} 条公告吗？`)) {
        const ids = multipleSelection.value.map(item => item.id).join(',');
        try {
          const res = await axios.get('http://localhost:8082/fruit-backend/NewsServlet', {
            params: { action: 'batchDelete', ids: ids }
          });
          if (res.data.code === 200) {
            ElMessage.success("批量删除成功");
            fetchNewsList();
          }
        } catch (error) {
          console.error("批量删除失败：", error);
        }
      }
    };

    const getImgUrl = (url) => {
      if (!url) return '';
      return url.startsWith('http') ? url : `http://localhost:8082/fruit-backend/${url}`;
    };

    const handleSelectionChange = (val) => {
      multipleSelection.value = val;
    };

    const resetForm = () => {
      form.id = '';
      form.title = '';
      form.typename = '';
      form.name = '';
      form.picture = '';
      form.introduction = '';
      form.content = '';
    };

    return {
      searchTitle,
      newsList,
      multipleSelection,
      dialogVisible,
      viewVisible,
      dialogTitle,
      form,
      viewData,
      fetchNewsList,
      handleAdd,
      handleEdit,
      submitForm,
      handleView,
      handleDelete,
      handleBatchDelete,
      getImgUrl,
      handleSelectionChange,
      resetForm
    };
  }
}
</script>

<style scoped>
/* 样式部分保持不变 */
.notification-container { padding: 20px; background-color: #fff; min-height: 100%; }
.page-header { font-size: 14px; margin-bottom: 25px; color: #333; }
.page-header .separator { margin: 0 8px; color: #27ae60; font-size: 10px; }
.page-header .active { color: #27ae60; }
.search-bar { margin-bottom: 20px; display: flex; align-items: center; }
.search-label { font-size: 14px; margin-right: 10px; color: #666; }
.action-buttons { margin-left: auto; }
.view-detail h2 { text-align: center; margin-bottom: 10px; color: #333; }
.view-detail .meta-info { text-align: center; font-size: 13px; color: #888; margin-bottom: 15px; }
.view-detail .intro-text { background-color: #f9f9f9; padding: 10px; border-left: 4px solid #27ae60; margin-bottom: 15px; font-size: 14px; }
.view-detail .content-text { font-size: 15px; color: #444; }
</style>