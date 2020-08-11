import Vue from 'vue';
import iView from 'iview';
import { router } from './router/index';
import { appRouter } from './router/router';
import store from './store';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import util from '@/libs/util';
import axios from 'axios';
import Api from '@/config/api';
import Cookies from 'js-cookie';
import Viser from 'viser-vue';

Vue.prototype.$ajax = axios;
axios.defaults.withCredentials = true;

function toFloor(number, scale = 8) {
    if (new Number(number) == 0) { //如果是"0.0000000000000000"
        return 0;
    }
    let str = number + ""; //转字符串
    if (str.indexOf('e') > -1 || str.indexOf('E') > -1) { //科学计数法
        let num = new Number(number).toFixed(scale + 1),
            str = num + "";
        return str.substring(0, str.length - 1);
    } else if (str.indexOf(".") > -1) { //小数
        if (scale == 0) {
            return str.substring(0, str.indexOf("."));
        }
        return str.substring(0, str.indexOf(".") + scale + 1); //截取指定位数
    } else { //整数
        return str;
    }
}
Vue.filter('toFloor', (number, scale) => {
    return toFloor(number, scale);
});
Vue.prototype.toFloor = toFloor;
Vue.prototype.host = "http://47.115.32.248:6004";       //测试服务器
axios.interceptors.response.use((response) => {
        const data = response.data
        let baseURL = response.config.baseURL;
        let url = response.config.url;
        if (data.code === 4000) {
            Cookies.remove('user');
            Cookies.remove('userPhone');
            Cookies.remove('userInfo');
            router.push({ name: 'login' });
        }
        if (data.code === 5000) {
            // this.$Message.error("您暂无权限");
            alert("您暂无权限")
                // router.push({ name: 'error-403' });
        }
        return response;
    })
    // console.log(this.$Message);
    // axios.interceptors.request.use((config) => {
    //   config.headers['x-auth-token'] = Cookies.get('x-auth-token');
    //   return config;
    // })

Vue.prototype.numToFixed = util.numToFixed; //主要用于科学计数法转数字

Vue.prototype.api = Api;
Vue.use(iView);
Vue.use(Viser);

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
    data: {
        currentPageName: ''
    },
    mounted() {
        this.currentPageName = this.$route.name;
        // 显示打开的页面的列表
        this.$store.commit('setOpenedList');
        this.$store.commit('initCachepage');
        // 权限菜单过滤相关
        this.$store.commit('updateMenulist');
    },
    created() {
        let tagsList = [];
        appRouter.map((item) => {
            if (item.children.length <= 1) {
                tagsList.push(item.children[0]);
            } else {
                tagsList.push(...item.children);
            }
        });
        this.$store.commit('setTagsList', tagsList);
    }
});