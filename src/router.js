import Vue from 'vue'
import Router from 'vue-router'
import Appointment from './views/Appointment.vue'
import moment from 'moment'

Vue.use(Router)

const year = moment().year();
const shortMonths = moment.monthsShort().map(m => m.toLowerCase());
const months = moment.months().map(m => m.toLowerCase());

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: Appointment,
      props: { month: months[moment().month()], day: moment().date() }
    }, ... months.map((month, index) => {
      return {
        path: `/${month}`,
        component: Appointment,
        props: { month: month, day: '' }
      }
    }), ... months.map((month, index) =>
      [ ... Array.apply(null, {length: moment(`${year}-${index +1}`, "YYYY-MM").daysInMonth()})
           .map(Number.call, Number)
           .map(day => {
             return {
               path: `/${month}/${day + 1}`,
               component: Appointment,
               props: { month: month, day: day + 1 },
             }
           }),
        { path: '/${month}/*', redirect: `/${month}` }
      ]).reduce((a,b) => a.concat(b)),
    {
      path: '/:month',
      redirect: to => {
        const month = to.params.month.toLowerCase();
        if (shortMonths.indexOf(month) != -1) {
          return { path: `/${months[shortMonths.indexOf(month)]}` };
        }
        if (!isNaN(month) && month > 0 && month < 13) {
          return { path: `/${months[month-1]}` }
        }
        return { path:'/' };
      }
    },
    {
      path: '/:val1/:val2',
      redirect: to => {
        let values = [ to.params.val1.toLowerCase(), to.params.val2.toLowerCase() ];
        if (values.map(a => !isNaN(a)).reduce((a, b) => a && b)) {
          if (values.map(a => (a < 13 && a > 0)).reduce((a, b) => a && b)) {
            return { path: `/${months[values[0] - 1]}/${values[1]}` };
          } else if (values.sort()[0] > 12) {
            return { path: '/' };
          } else {
            return { path: `/${months[values.sort()[0] - 1]}/${values.sort()[1]}`}
          }
        }
        values = values.map((value) => {
          let month = Math.max(shortMonths.indexOf(value), months.indexOf(value))
          return month > -1 ? months[month] : Number(value)
        });
        if (values.map(a => Number.isNaN(a)).reduce((a, b) => a && b)) {
          return { path:'/' };
        }
        if (values.map(a => Number.isNaN(a)).reduce((a,b) => !a ^ !b)) {
          let month = values.filter(a => !Number.isNaN(a))[0];
          if (!isNaN(month)) {
            return { path: month < 13 && month > 0 ? `${months[month - 1]}` : '/'}
          } else {
            return { path: `/${month}` }
          }
        }
        if (values.map(a => typeof(a) == 'string').reduce((a, b) => a && b)) {
          return { path: `/${values[0]}`}
        }
        values = values.sort();
        return { path: `/${values[1]}/${values[0]}` };
      }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
