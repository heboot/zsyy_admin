// 题库管理
export const questionRouter = [{
    // 新增题库
    id: 216,
    path: '/add_question',
    icon: 'ios-plus',
    component: resolve => {
        require(['@/views/question/add-question.vue'], resolve)
    }
},
// 题库列表
{
    id:217,
    path:"/question_list",
    icon:'search',
    component: resolve => {
        require(['@/views/question/question-list.vue'], resolve)
    }
},
// 修改题目
{
    id:241,
    path:"/update_subject",
    icon:'ios-plus',
    component: resolve => {
        require(['@/views/question/update-subject.vue'], resolve)
    }
}
]