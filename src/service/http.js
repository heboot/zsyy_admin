import axios from 'axios'
import qs from 'qs'

// export const BASEURL = axios.defaults.baseURL = 'http://62.234.59.112:6004';    //开发服务器
// export const BASEURL = axios.defaults.baseURL = 'http://121.41.69.65:6004';    //开发服务器
export const BASEURL = axios.defaults.baseURL = 'http://47.115.32.248:6004';    //开发服务器

export const fetch = (url, params = {}) => {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err);
      })
  })
}

export const post = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    axios.post(url, qs.stringify(data, { arrayFormat: 'repeat' }),{headers:{'Content-Type': 'application/json,charset=utf-8'}})
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err);
      })
  })
}

export const download = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    axios.post(url, qs.stringify(data, { arrayFormat: 'repeat' }),{headers:{'Content-Type': 'application/json,charset=utf-8'}})
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err);
      })
  })
}


export const patch = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    axios.patch(url, qs.stringify(data, { arrayFormat: 'repeat' }))
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err);
      })
  })
}

export const put = (url, data = {}) => {
  return new Promise((resolve, reject) => {
    axios.put(url, qs.stringify(data))
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err);
      })
  })
}

export const postConfig = (url, data = {}, config) => {
  return new Promise((resolve, reject) => {
    axios.post(url, data, config)
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err);
      })
  })
}