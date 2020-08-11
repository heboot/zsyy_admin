//用户管理
export const userRouter = [{
    id: 214, //查询用户页面
    path: '/userMgt',
    icon: 'search',
    component: resolve => {
        require(['@/views/userMgt/userMgt.vue'], resolve)
    }
}];

