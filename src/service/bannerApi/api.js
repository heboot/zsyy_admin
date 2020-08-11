import { fetch, postConfig,post } from '../http.js'


// 轮播图查询
export const getBannerList = data => postConfig('/admin/banner/pageQuery', data);

// 新增
export const addBanner = data => postConfig('/admin/banner/add', data);

// 修改
export const updateBanner = data => postConfig('/admin/banner/update', data);

// 删除
export const detBanner = (id) => fetch(`/admin/banner/delete/${id}`);