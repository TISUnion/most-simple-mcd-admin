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

export function updateServerInfo(data) {
  return request({
    url: '/api/v1/server/info',
    method: 'POST',
    data
  })
}

export function uploadServer(data) {
  return request({
    url: '/api/v1/upload/server',
    method: 'POST',
    data
  })
}

export function getConfigVal(params) {
  return request({
    url: '/api/v1/config/val',
    method: 'GET',
    params
  })
}

export function delTmpFlie() {
  return request({
    url: '/api/v1/tmp/files',
    method: 'POST'
  })
}

export function operatePlugin(data) {
  return request({
    url: '/api/v1/plugin',
    method: 'POST',
    data
  })
}

export function closeSystem() {
  return request({
    url: '/api/v1/close',
    method: 'POST'
  })
}
