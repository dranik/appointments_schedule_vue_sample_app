<template id="schedule">
  <div class="schedule">
    <header class="header" v-if = 'slots[0].time'>
      <p>Select a time on {{slots[0].time.format("D MMMM YYYY")}} that works best for you.</p>
    </header>
    <div v-for="(slot) in slots"
         class="slot"
         :class="slot.occupied ? 'crossedout' : ''"
         v-bind:key = 'slot.time'>
      <button @click="slot.occupied ? '' : occupy(slot.time)">
        {{ slot.time.format('HH:mm') }}
      </button>
    </div>
  </div>
</template>
<script>
import Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
import common from '../mixins/common'

export default {
  mixins: [common],
  data() {
    return {
      slotLabels: null,
    };
  },
  props: ["day", "month"],
  computed: {
    slots() {
      return this.$store.state.slots.filter(
        slot => slot.date() == this.day && slot.month() == this.monthLabels().indexOf(this.month)
      ).map(slot => ({
        time: slot,
        occupied:
          this.$store.state.appointments.filter(appointment => appointment.isSame(slot)).length > 0
          || slot.isBefore(moment())
      }));
    }
  },
  methods: {
    occupy(slot) {
      if (confirm(`Do you confirm the appointment for ${slot.format("D MMMM YYYY HH:mm")}?`)) {
        this.$store.dispatch('addAppointment', slot)
      }
    }
  }
}
</script>
<style lang="scss">
.schedule {
  border: 1px solid var(--blue-grey);
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  width: 322px;
  height: 240px;

  > .header {
    padding: .5rem;
    font-size: 1rem;
    grid-column: 1 / span 7;
    text-align: left;
  }

  > * {
    align-items: center;
    display: flex;
    justify-content: center;
  }

  > .slot {
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
</style>
