import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router/index'
import 'virtual:windi.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
createApp(App).use(router).use(ElementPlus).mount('#app')
