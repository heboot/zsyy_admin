import { fetch, postConfig } from '../http.js'

// 查询
export const getTalbe = data => postConfig("/admin/data/pageQuery",data);

// 修改用户分类
export const updateUser = data => postConfig("/admin/data/update/user",data);

// 修改题目分类
export const updateQuestion = data => postConfig("/admin/data/update/question",data);

// 修改课程分类
export const updateCourse = data => postConfig("/admin/data/update/course",data);

// 新增用户分类
export const addUser = data => postConfig("/admin/data/save/user",data);

// 新增题目分类
export const addQuestion = data => postConfig("/admin/data/save/question",data); 

// 新增课程分类
export const addCourse = data => postConfig("/admin/data/save/course",data); 

//根据课程id查对应内容
export const getContent = data => postConfig("/admin/data/queryCourseContent",data);

// 修改课程内容
export const updateCourseContent = data => postConfig("/admin/data/update/content",data); 

// 新增课程内容
export const addCourseContent = data => postConfig("/admin/data/save/content",data); 

// 删除课程内容
export const delContent = (id) => fetch(`/admin/data/delete/courseContent/${id}`); 

// 查询意见反馈
export const getFeedback = data => postConfig("/admin/feedback/pageQuery",data); 

// 反馈回复
export const feedBackAnswer = data => postConfig("/admin/feedback/answer",data); 
// 删除反馈
export const delFeedBack = (id) => fetch(`/admin/feedback/delete/${id}`); 
