import { fetch, postConfig,post } from '../http.js'


// 获取所有课程分类
export const getCoursetypeList = data => fetch('admin/course/findAllCategory', data);

// 获取用户分类
export const getUserClass = data => fetch('admin/user/findAllCategory', data);

// 上传课程
export const addCourseData = data => postConfig('/admin/course/upload', data);

// 查询课程
export const getCourseList = data => postConfig('/admin/course/findCourse', data);

// 修改课程状态
export const changeStatu = data => post('/admin/course/updateStatus', data);

// 删除课程/课时
export const delCourse = (type,id) => fetch(`/admin/course/delete/${type}/${id}`);

// 根据id查询信息
export const getCourseInfo = (id) => fetch(`/admin/course/findCourse/${id}`);