import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/most.simple.mcd.User/login',
    method: 'GRPC',
    data
  })
}

export function getInfo() {
  return request({
    url: '/most.simple.mcd.User/info',
    method: 'GRPC'
  })
}

export function logout() {
  return request({
    url: '/most.simple.mcd.User/logout',
    method: 'GRPC'
  })
}

export function updateUserData(data) {
  return request({
    url: '/most.simple.mcd.User/update',
    method: 'GRPC',
    data
  })
}
