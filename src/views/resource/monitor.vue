<template>
  <div class="app-container">
    <Chart
      height="90vh"
      width="100%"
      server-id="a72498c4-3e1a-462d-a0c2-3eecc79c054d"
    />
  </div>
</template>
<script>
import Chart from '@/components/Charts/LineMarker'
export default {
  name: 'Monitor',
  components: { Chart },
  data() {
    return {
      id: ''
    }
  }, created() {
    this.id = this.$route.params.id
  }
}
</script>
