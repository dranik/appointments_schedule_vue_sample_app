<template>
  <div class="home">
    <div class="container">
      <div class="row">
        <div class="col left-main">
          <Calendar :day='day' :month='month'>
          </Calendar>
          <br/>
        </div>
        <div class="col right-main">
          <Schedule :day='day' :month='month' v-if='day'>
          </Schedule>
          <h6 v-else>Select a day to choose time</h6>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Calendar from '@/components/Calendar.vue'
import Schedule from '@/components/Schedule.vue'

export default {
  props: ['month', 'day'],
  name: 'appointment',
  components: {
    Calendar,
    Schedule
  }
}
</script>
<style lang='scss'>
html {
  box-sizing: border-box;
  font-size: 16px;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

html,
body {
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.left-main {
  background: DodgerBlue;
  color: white;
  display: flex;
  justify-content: center;
}

.right-main {
  background: white;
  color: black;
  display: flex;
  justify-content: center;
  padding-top: 10px;
}
</style>
