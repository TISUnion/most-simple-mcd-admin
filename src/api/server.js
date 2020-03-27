import request from '@/utils/request'

export function getList() {
  return request({
    url: '/api/v1/server/list',
    method: 'GET'
  })
}

export function pingServer(params) {
  return request({
    url: '/api/v1/server/ping',
    method: 'GET',
    params
  })
}

export function operateServer(data) {
  return request({
    url: '/api/v1/server',
    method: 'POST',
    data
  })
}

export function downloadLog(params) {
  return request({
    url: '/api/v1/log/download',
    method: 'GET',
    params,
    responseType: 'blob'
  })
}

export function getServerDetail(params) {
  return request({
    url: '/api/v1/server/detail',
    method: 'GET',
    params
  })
}