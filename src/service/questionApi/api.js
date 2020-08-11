import { fetch, postConfig } from '../http.js'

// 获取用户分类
export const getUserClass = data => fetch('admin/user/findAllCategory', data);

// 获取题目分类
export const getTopicType = data => fetch('admin/subject/getQuestionCategory', data);

//查询题目
export const getTopicList = data => postConfig('admin/subject/pageQuery', data);

// 上传题库
export const uploadBank = data => postConfig('admin/bank/uploadBank', data);

// 新增题目
export const addSubject = data => postConfig('admin/subject/add', data);

// 查询题库
export const getList = data => postConfig('admin/bank/pageQuery', data);

// 删除题库
export const delBank = (id) => fetch(`admin/bank/delete/${id}`);

// 修改题库
export const updateBank = data => postConfig('admin/bank/update', data);

// 删除题目
export const delSubject = (id) => fetch(`admin/subject/delete/${id}`);

// 修改题目
export const updateSubject = data => postConfig('admin/subject/update', data);