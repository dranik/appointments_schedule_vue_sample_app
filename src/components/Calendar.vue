<template id="calendar">
  <div class="calendar">
    <header class="header">
      <h6>Select a date for your free LASIK exam</h6>
    </header>
    <header class="header">
      <button @click="previousMonth" v-if='month!="january"'>&lt;&lt;</button>
      <button v-else></button>
      <span>{{ month }}</span>
      <button @click="nextMonth" v-if='month!="december"'>&gt;&gt;</button>
      <button v-else></button>
    </header>
    <div class="headings" v-for="dayLabel in dayLabels">
      {{ dayLabel }}
    </div>
    <div v-for="(day) in daysArray"
         class="day"
         :class="dayClassObj(day)">
      <button @click="setSelectedDate(day)">
        {{ day.date.date() }}
      </button>
    </div>
  </div>
</template>
<script>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
import router from '../router';
import common from '../mixins/common'
const DAY_LABELS = moment.weekdaysShort();
const year = moment.utc().year();
console.log(common);

export default {
  mixins: [common],
  data() {
    return {
      dayLabels: null,
    };
  },
  created() {
    this.dayLabels = DAY_LABELS.slice();
  },
  props: ["day", "month"],
  computed: {
    daysArray() {
      const dayToObj = (day) => ({
        date: day,
        isCurrentMonth:  day.isSame(startOfMonth, 'month'),
        isToday: day.isSame(new Date, 'day') && day.isSame(new Date, 'month'),
        isSelected: day.date() == Number(this.day)
      });
      const startOfMonth = moment(`${year}-${this.monthLabels().indexOf(this.month) + 1}-01 00:00:00Z`);
      const endOfMonth = startOfMonth.clone().endOf('month');
      const daysOfMonth = Array.from(
        moment
          .range(startOfMonth.toDate(), endOfMonth.toDate())
          .by('day')
      ).map(dayToObj);
      const shift = startOfMonth.day();
      const daysOfPrevMonth = Array.from(
        moment
          .range(
            startOfMonth.clone().subtract(shift, 'days'),
            startOfMonth.clone().subtract(1, 'days'),
          )
          .by('day')
      ).map(dayToObj);
      const daysOfNextMonth = Array.from(
        moment
          .range(
            endOfMonth.clone().add(1, 'days'),
            endOfMonth
              .clone()
              .add(
                7 - (daysOfMonth.length + daysOfPrevMonth.length) % 7,
                'days'
              )
            )
          .by('day')
      ).map(dayToObj);
      return [
        ... daysOfPrevMonth,
        ... daysOfMonth,
        ... (daysOfMonth.length + daysOfPrevMonth.length) % 7 ? daysOfNextMonth : []
      ];
    }
  },
  methods: {
    isAllOccupied(day) {
      return this.$store.state.slots.filter(
        slot => slot.date() == day.date.date() && slot.month() == day.date.month()
      ).map(slot => (
        this.$store.state.appointments.filter(appointment => appointment.isSame(slot)).length > 0
      )).reduce((a,b) => a && b);
    },
    dayClassObj(day) {
      return {
        'current': this.month == this.monthLabels()[day.date.month()],
        'selected': this.day == day.date.date() && this.month == this.monthLabels()[day.date.month()],
        'crossedout': day.date.isBefore(moment.utc().subtract(1, 'day')) || this.isAllOccupied(day)
      };
    },
    nextMonth() {
      router.push({ path: `/${this.monthLabels()[this.monthLabels().indexOf(this.month)+1]}` });
    },
    previousMonth() {
      router.push({ path: `/${this.monthLabels()[this.monthLabels().indexOf(this.month)-1]}` });
    },
    setSelectedDate(day) {
      router.push({ path: `/${this.monthLabels()[day.date.month()]}/${day.date.date()}` });
    }
  }
}
</script>
<style lang="scss">
body {
  :root {
  --white: hsl(0, 0%, 100%);
  --blue-grey: hsl(210, 28%, 85%);
  --grey: hsl(0, 0%, 96%);
  --black: hsl(0, 0%, 20%);
}



.calendar {
  border: 1px solid var(--blue-grey);
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  width: 322px;

  > .header {
    padding: .75rem;
    font-size: 1.25rem;
    grid-column: 1 / span 7;

    >span {
      flex: 1;
      text-align: center;
    }

    >span:first-letter {
        text-transform:capitalize;
    }

    button {
      border: none;
      background: DodgerBlue;
      color: white;
      margin: 0 1rem;
      padding: .25rem .5rem;
    }
  }

  > * {
    align-items: center;
    display: flex;
    justify-content: center;
  }

  > .day {
    color: CornflowerBlue;
    font-size: 1rem;

    &.current.selected {
      border: 1px solid var(--blue-grey);
      background: white;
      color: DodgerBlue;
    }

    &.current {
      color: white;
    }

    &.crossedout {
      text-decoration: line-through;
    }

    &::before {
      content: "";
      display: inline-block;
      height: 0;
      padding-bottom: 100%;
      width: 1px;
    }

    button {
      color: inherit;
      background: transparent;
      border: none;
      height: 100%;
      width: 100%;
      &:hover {
        background: var(--grey);
        transition: background 150ms;
      }
    }
  }
}

.text-center {
  text-align: center;
}
}
</style>
