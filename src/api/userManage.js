import request from '@/utils/request'
export default {
  // 用于user.vue中调用后端接口
  getUserList(searchModel) {
    return request({
      url: '/user/list',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        username: searchModel.username,
        email: searchModel.email
      }
    })
  },
  addUser(user) {
    return request({
      url: '/user',
      method: 'post',
      data: user
    })
  },
  modifyUser(user) {
    return request({
      url: '/user/modify',
      method: 'post',
      data: user
    })
  },
  deleteUser(id) {
    return request({
      url: '/user/delete/',
      method: 'delete',
      params: {
        id: id
      }
    })
  },
  getInfo(token) {
    return request({
      url: '/user/info',
      method: 'get',
      params: { token }
    })
  }
}
