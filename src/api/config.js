import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/api/v1/config/list',
    method: 'GET',
    data
  })
}

export function updateConfig(data) {
  return request({
    url: '/api/v1/config',
    method: 'POST',
    data
  })
}
