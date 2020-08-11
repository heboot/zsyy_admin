import { fetch, postConfig } from '../http.js'

// 分页查询
export const queryAll = data => postConfig("admin/machine/page",data)

// 增加
export const addChine = data => postConfig("/admin/machine/save",data)

// 编辑
export const editorChine = data => postConfig("/admin/machine/update",data)