import request from '@/utils/request'

export default {
  getStaList(searchModel) {
    return request({
      url: '/staOverview/page',
      method: 'get',
      params: {
        pageNo: searchModel.pageNo,
        pageSize: searchModel.pageSize,
        staName: searchModel.staName,
        staCode: searchModel.staCode,
        staSort: searchModel.staSort
      }
    })
  },
  addSta(sta) {
    return request({
      url: '/staOverview/add',
      method: 'post',
      data: sta
    })
  },
  modifySta(sta) {
    return request({
      url: '/staOverview/modify',
      method: 'post',
      data: sta
    })
  },
  deleteSta(staCode) {
    return request({
      url: '/staOverview/delete',
      method: 'delete',
      params: {
        staCode: staCode
      }
    })
  }
}
