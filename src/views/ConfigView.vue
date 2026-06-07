<template>
  <div>
    <el-card>
      <el-button type="primary" @click="openAdd">新增轮播</el-button>

      <el-table :data="tableData" style="margin-top: 20px">
        <el-table-column prop="id" label="ID" width="80"/>
        <el-table-column prop="imgUrl" label="图片URL"/>
        <el-table-column prop="linkUrl" label="跳转链接"/>
        <el-table-column prop="sortOrder" label="排序"/>

        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="mini" @click="edit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog v-model="dialogVisible" title="轮播配置">
      <el-form :model="form">
        <el-form-item label="图片URL">
          <el-input v-model="form.imgUrl"/>
        </el-form-item>
        <el-form-item label="跳转链接">
          <el-input v-model="form.linkUrl"/>
        </el-form-item>
        <el-form-item label="排序">
          <el-input v-model="form.sortOrder" type="number"/>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      form: { id: null, imgUrl: "", linkUrl: "", sortOrder: 0 },
      isEdit: false
    };
  },

  mounted() {
    this.load();
  },

  methods: {

    // ✅ 统一接口
    load() {
      axios.get("http://localhost:8082/fruit-backend/configQuery").then(res => {
        this.tableData = res.data.configs;
      });
    },

    openAdd() {
      this.form = { id: null, imgUrl: "", linkUrl: "", sortOrder: 0 };
      this.isEdit = false;
      this.dialogVisible = true;
    },

    edit(row) {
      this.form = { ...row };
      this.isEdit = true;
      this.dialogVisible = true;
    },

    save() {
      if (this.isEdit) {
        axios.put("http://localhost:8082/fruit-backend/config", this.form)
          .then(() => {
            this.dialogVisible = false;
            this.load();
          });
      } else {
        axios.post("http://localhost:8082/fruit-backend/config", this.form)
          .then(() => {
            this.dialogVisible = false;
            this.load();
          });
      }
    },

    del(id) {
      axios.delete("http://localhost:8082/fruit-backend/config?id=" + id)
        .then(() => {
          this.load();
        });
    }
  }
};
</script>