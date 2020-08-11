import { BASEURL, fetch, post, patch, put, postConfig } from './http.js'

export const BASICURL = BASEURL;
// export const uploadPic = data => post('', data);
// export const getALL = () => post(地址);  post
// export const getALL = () => fetch(地址);  get

//POST获取 "首页"=>"获取验证码后登录"
export const signIn = data => post('admin/system/employee/sign/in', data);

//POST获取 "首页"=>"再次获取验证码后登录"
export const getCodeAgain = data => post('admin/code/sms-provider/login', data);

//post "用户管理" => "用户详情"
export const employeeDetail = data => post('admin/system/employee/detail', data);

//post "个人中心" => "修改密码"
export const fixPersonalPW = data => post('admin/system/employee/update-password', data);

// POST "系统管理" => "角色管理"
export const roleManage = (data) => post('admin/system/role/all', data);

// POST "系统管理" => "部门管理"=>"所有部门"
export const departmentManage = (data) => post('admin/system/department/all', data);

// POST "系统管理" => "部门管理"->"添加或修改部门信息"
export const addAuditDepart = data => post('admin/system/department/merge', data);

// POST "系统管理" => "部门管理"->"查看部门详细信息"
export const departDetail = data => post('admin/system/department/detail', data);

// POST "系统管理" => "部门管理"->"删除部门"
export const delDepart = data => post('admin/system/department/deletes', data);

//POST "系统管理" => "权限管理"
export const permissionManage = data => post('admin/system/permission/page-query', data);

//POST "系统管理" => "添加编辑权限"
export const addAuditPermission = data => post('admin/system/permission/merge', data);

//POST "系统管理" => "删除权限"
export const delPermission = data => post('admin/system/permission/deletes', data);

// POST "系统管理" => "角色管理"->"查询角色权限"
export const queryRolePermission = data => post('admin/system/role/permission', data);

//POST获取 "会员实名审核"
export const MemberRealNameList = data => post('admin/member/member-application/page-query', data);

//post "系统管理" => "系统日志"
export const accessLog = (url, data) => fetch(`admin/system/access-log/page-query/${url}`, data);

//post "用户管理" => "用户查询"
export const queryEmployee = data => post('admin/system/employee/page-query', data);

//post "用户管理" => "新增或者修改用户"
export const addAuditEmployee = data => post('/admin/system/employee/merge', data);

//post "用户管理" => "删除用户"
export const delEmployee = data => post('admin/system/employee/deletes', data);

//Post "系统管理" => "意见反馈查询"
export const getFeedData = data => postConfig('/admin/suggest/sugg/page-query', data);

// POST "获取全部权限"
export const getAllPermission = () => post('admin/system/role/permission/all');

// POST "系统管理" => "角色管理"->"添加或修改角色信息"
export const addAuditRole = data => post('admin/system/role/merge', data);

// POST "系统管理" => "角色管理"->"删除角色"
export const deleteRole = data => post('admin/system/role/deletes', data);

// 课程列表
// 获取所有课程分类
export const getCoursetypeList = data => fetch('admin/course/findAllCategory', data);

// 获取用户分类
export const getUserClass = data => fetch('admin/user/findAllCategory', data);








