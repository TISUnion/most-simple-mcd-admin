import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/most.simple.mcd.User/login',
    method: 'POST',
    data
  })
}

export function getInfo() {
  return request({
    url: '/most.simple.mcd.User/info',
    method: 'POST',
    data: {}
  })
}

export function logout() {
  return request({
    url: '/most.simple.mcd.User/logout',
    method: 'POST',
    data: {}
  })
}

export function updateUserData(data) {
  return request({
    url: '/most.simple.mcd.User/update',
    method: 'POST',
    data
  })
}
