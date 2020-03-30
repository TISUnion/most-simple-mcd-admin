<template>
  <div v-loading="loading" class="app-container">
    <Chart height="90vh" width="100%" />
  </div>
</template>
<script>
import Chart from '@/components/Charts/LineMarker'
export default {
  name: 'Monitor',
  components: { Chart },
  data() {
    return {}
  }
}
</script>
