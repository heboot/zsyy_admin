// 题库管理
export const testPaperRouter = [
{
    // 新增试卷
    id: 243,
    path: '/add_testPaper',
    icon: 'ios-plus',
    component: resolve => {
        require(['@/views/testPaper/add_testPaper.vue'], resolve)
    }
},
// 试卷列表
{
    id:244,
    path:"/testPaper_list",
    icon:'search',
    component: resolve => {
        require(['@/views/testPaper/testPaper_list.vue'], resolve)
    }
},
// 报表
{
    id:245,
    path:"/statement",
    icon:'search',
    component: resolve => {
        require(['@/views/testPaper/statement.vue'], resolve)
    }
}
]