import Vue from 'vue/dist/vue.common'
import {
    Tree
} from 'element-ui'
import App from './app.vue'

Vue.use(Tree)

new Vue({
    el: '#app',
    render: h => h(App),
})