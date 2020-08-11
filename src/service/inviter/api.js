import { fetch, postConfig, post } from '../http.js'

export const getInvitetList = data => fetch(`/admin/admin/top/${data.pageNo}/${data.pageSize}`)


export const seeInvitetTreeList = userId => fetch(`/admin/admin/tree/${userId}`)