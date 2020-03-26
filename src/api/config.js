import request from '@/utils/request'

export function getList() {
  return request({
    url: '/api/v1/config/list',
    method: 'GET'
  })
}

export function updateConfig(data) {
  return request({
    url: '/api/v1/config',
    method: 'POST',
    data
  })
}
