import { fetch, postConfig } from '../http.js'

// 列表查询
export const getList = data => postConfig(`/admin/inform/pageQuery/`,data);
