import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);

export default {
  methods: {
    monthLabels(){
      return moment.months().map(m => m.toLowerCase());
    }
  }
}
