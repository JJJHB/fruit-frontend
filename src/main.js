import { createApp } from 'vue'
// 不写路径默认从node_modules找
// 从 Vue 框架里拿一个“创建应用”的函数
import App from './App.vue'
// App.vue = 整个项目的最外层组件（根组件）
//import axios from 'axios'
//import App from './views/MenuView.vue'

import router from './router/router'
// 省略了 .js 后缀。
import store from './store'
import ElementPlus from 'element-plus'
// 引入 UI 组件库
import "element-plus/dist/index.css"
createApp(App).use(store).use(ElementPlus).use(router).mount('#app')
// 创建应用 + 注册功能（核心）


