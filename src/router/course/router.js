// 课程管理
export const courseRouter = [{ 
    // 新增课程
    id:229,
    path: '/add_course',
    icon: 'ios-plus',
    component: resolve => {
        require(['@/views/course/add-course.vue'], resolve)
    }
},
{ 
    // 课程列表
    id:230,
    path: '/course_list',
    icon: 'search',
    component: resolve => {
        require(['@/views/course/course-list.vue'], resolve)
    }
}
]