import request from '@/utils/request'

export function getList() {
  return request({
    url: '/most.simple.mcd.McServer/list',
    method: 'POST'
  })
}

export function pingServer(data) {
  return request({
    url: '/most.simple.mcd.McServer/getServerState',
    method: 'POST',
    data
  })
}

export function operateServer(data) {
  return request({
    url: '/most.simple.mcd.McServer/operateServer',
    method: 'POST',
    data
  })
}

export function downloadLog(params) {
  return request({
    url: '/most.simple.mcd.Admin/getLog',
    method: 'POST',
    params,
    responseType: 'blob'
  })
}

export function getServerDetail(data) {
  return request({
    url: '/most.simple.mcd.McServer/detail',
    method: 'POST',
    data
  })
}

export function updateServerInfo(data) {
  return request({
    url: '/most.simple.mcd.McServer/updateServerInfo',
    method: 'POST',
    data
  })
}

export function uploadServer(data) {
  return request({
    url: '/most.simple.mcd.Admin/addUpToContainer',
    method: 'POST',
    data
  })
}

export function getConfigVal(data) {
  return request({
    url: '/most.simple.mcd.Admin/getConfigVal',
    method: 'POST',
    data
  })
}

export function delTmpFlie() {
  return request({
    url: '/most.simple.mcd.Admin/delTmpFlie',
    method: 'POST'
  })
}

export function operatePlugin(data) {
  return request({
    url: '/most.simple.mcd.Admin/operatePlugin',
    method: 'POST',
    data
  })
}

export function closeSystem() {
  return request({
    url: '/most.simple.mcd.Admin/closeMcd',
    method: 'POST'
  })
}

export function getAllServerSide() {
  return request({
    url: '/most.simple.mcd.McServer/getServerSide',
    method: 'GET'
  })
}
