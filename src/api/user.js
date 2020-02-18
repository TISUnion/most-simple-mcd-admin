import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'POST',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/v1/user/info',
    method: 'GET'
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'POST'
  })
}
