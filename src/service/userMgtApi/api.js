import { fetch, postConfig,post} from '../http.js'

//查询用户
export const getList = data => postConfig('/admin/user/findAllUser', data);

// 获取所有用户分类
export const getUserClass = data => fetch('admin/user/findAllCategory', data);

//修改用户禁用状态
export const changeStatu = data => post('/admin/user/updateUserStatus/',data);

//新增用户
export const addUser = data => postConfig('/admin/user/add', data);

// 发送消息
export const sendMsg = data => postConfig('/admin/inform/send', data);

// 删除用户
export const delUser = data => postConfig('/admin/user/delete',data)