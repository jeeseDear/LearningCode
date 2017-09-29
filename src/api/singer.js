import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  const data = Object.assign({}, commonParams, {
    channel:'singer',
    page:'list',
    pageSize:100,
    pagenum:1,
    hostUin:0,
    needNewCode:0,
    platform:'yqq',
    g_tk:5381,
    key:'all_all_all'
  })
  return jsonp(url, data, options)
}
export function getSingerDetail(singerId) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  const data = Object.assign({}, commonParams, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    singermid: singerId
  })
  return jsonp(url, data, options)
}