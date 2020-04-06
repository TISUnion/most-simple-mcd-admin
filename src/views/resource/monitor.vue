<template>
  <div class="app-container">
    <Chart
      height="90vh"
      width="100%"
      :server-id="id"
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
