<template>
  <div class="register-view">
    <el-card class="register-card">
      <h2 class="title">用户注册</h2>

      <el-form
        ref="registerForm"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="账号" prop="username">
          <el-input
            v-model="form.username"
            placeholder="请输入账号"
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            show-password
            placeholder="请输入密码"
          />
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex">
            <el-radio value="男">男</el-radio>
            <el-radio value="女">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="form.phone"
            placeholder="请输入手机号"
          />
        </el-form-item>

        <el-form-item label="头像">
          <el-input
            v-model="form.picture"
            placeholder="请输入头像地址(可选)"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm"
          >
            注册
          </el-button>

          <el-button
            @click="resetForm"
          >
            重置
          </el-button>

          <router-link
            to="/login"
            class="login-link"
          >
            去登录
          </router-link>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { ElMessage } from "element-plus"

export default {
  name: "RegisterView",

  data() {
    return {
      form: {
        username: "",
        password: "",
        sex: "男",
        phone: "",
        picture: "",
        money: 0
      },

      rules: {
        username: [
          {
            required: true,
            message: "请输入账号",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "账号长度3-20位",
            trigger: "blur"
          }
        ],

        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 6,
            message: "密码至少6位",
            trigger: "blur"
          }
        ],

        phone: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式错误",
            trigger: "blur"
          }
        ]
      }
    }
  },

  methods: {
    submitForm() {
      this.$refs.registerForm.validate((valid) => {
        if (!valid) {
          return
        }

        console.log(this.form)

        /*
        axios.post(
          "http://localhost:8080/user/register",
          this.form
        )
        */

        ElMessage.success("注册成功")

        this.$router.push("/login")
      })
    },

    resetForm() {
      this.$refs.registerForm.resetFields()
    }
  }
}
</script>

<style scoped>
.register-view {
  min-height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  background: #f5f7fa;
}

.register-card {
  width: 500px;
}

.title {
  text-align: center;
  margin-bottom: 25px;
}

.login-link {
  margin-left: 20px;
  text-decoration: none;
  color: #409eff;
}
</style>