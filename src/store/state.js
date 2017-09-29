import { playMode } from 'common/js/config'
const state = {
  singer:{},
  fullScreen : false,
  playing : false,
  playlist : [],
  sequenceList : [],
  mode:playMode.sequence,
  currentIndex : -1
}
export default state