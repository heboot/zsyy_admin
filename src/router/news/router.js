// 通知管理
export const newsRouter = [{
  //发送消息
  id: 232, 
  path: '/info_mgt',
  icon: 'chatbox',
  component: resolve => {
    require(['@/views/news/news-mgt.vue'], resolve)
  }
},
];