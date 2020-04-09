<template>
  <div class="app-container">
    <Chart
      height="90vh"
      width="100%"
      :server-id="id"
      :server-name="serverName"
    />
  </div>
</template>
<script>
import Chart from './LineMarker'
export default {
  name: 'Monitor',
  components: { Chart },
  data() {
    return {
      id: '',
      serverName: ''
    }
  }, created() {
    this.id = this.$route.params.id
    this.serverName = this.$route.params.name
  }
}
</script>
