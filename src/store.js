import Vue from 'vue'
import Vuex from 'vuex'
import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    slots: Array.from(
      moment
        .range(
          moment.utc().startOf('year'),
          moment.utc().endOf('year')
        ).by('day')
    ).map((day) =>
      Array.from(moment.range(
        day.clone().add(10, 'hours'),
        day.clone().add(18, 'hours')
      ).by('minutes', { step: 30 }))
    ).reduce((a,b) => a.concat(b)),
    appointments: []
  },
  mutations: {
    addAppointment(state, appointment) {
      state.appointments = [... state.appointments, appointment];
    }
  },
  actions: {
    addAppointment (context, appointment) {
      context.commit('addAppointment', appointment)
    }
  }
})
