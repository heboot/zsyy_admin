import { fetch, postConfig } from '../http.js'
// 上传试卷
export const uploadTest = data => postConfig('admin/test/question/uploadTest', data);
// 查询试卷列表
export const testList = data => postConfig('admin/test/question/pageQuery', data);
// 查询报表列表
export const statement = data => postConfig('admin/test/question/getStatement', data);
// 查询报表列表
export const statementExcel = data => fetch('admin/test/question/statement/export', data);
