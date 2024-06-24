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
  }
}
