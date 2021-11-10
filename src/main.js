import { createApp } from 'vue'
import App from './App.vue'
import store from './store'

import './registerServiceWorker'

import './css/base.scss'

createApp(App).use(store).mount('#app')
