//banner管理
export const bannerRouter = [{ 
    id:240,
    path: '/bannerList',
    icon: 'images',
    component: resolve => {
        require(['@/views/banner/banner.vue'], resolve)
    }
},
]