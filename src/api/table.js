import fetch from '@/utils/fetch'

export function getList(params) {
  return fetch({
    url: '/table/list',
    method: 'get',
    params
  })
}

export function gettzList(params) {
  return fetch({
    url: '/tztable/list',
    method: 'get',
    params
  })
}