import request from '@/utils/request'

export function getList() {
  return request({
    url: '/api/v1/server/list',
    method: 'GET'
  })
}

export function operateServer(data) {
  return request({
    url: '/api/v1/server',
    method: 'POST',
    data
  })
}
