<template>
  <div :id="id" :class="className" :style="{height:height,width:width}" :serverId="serverId" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
const data = [
  { name: '2018/01/01 00:00:10', value: ['2018/01/01 00:00:10', 30] },
  { name: '2018/01/01 00:10:10', value: ['2018/01/01 00:10:10', 35] },
  { name: '2018/01/01 00:20:10', value: ['2018/01/01 00:20:10', 32] },
  { name: '2018/01/01 00:30:10', value: ['2018/01/01 00:30:10', 40] },
  { name: '2018/01/01 00:40:10', value: ['2018/01/01 00:40:10', 50] },
  { name: '2018/01/01 00:50:10', value: ['2018/01/01 00:50:10', 38] },
  { name: '2018/01/01 01:50:10', value: ['2018/01/01 01:50:10', 31] },
  { name: '2018/01/01 02:50:10', value: ['2018/01/01 02:50:10', 45] },
  { name: '2018/01/01 03:50:10', value: ['2018/01/01 03:50:10', 42] },
  { name: '2018/01/01 04:50:10', value: ['2018/01/01 04:50:10', 46] },
  { name: '2018/01/01 05:50:10', value: ['2018/01/01 05:50:10', 44] },
  { name: '2018/01/01 06:50:10', value: ['2018/01/01 06:50:10', 38] },
  { name: '2018/01/01 07:50:10', value: ['2018/01/01 07:50:10', 32] },
  { name: '2018/01/01 10:50:10', value: ['2018/01/01 10:50:10', 45] },
  { name: '2018/01/01 11:50:10', value: ['2018/01/01 11:50:10', 10] },
  { name: '2018/01/01 12:50:10', value: ['2018/01/01 12:50:10', 56] },
  { name: '2018/01/01 14:50:10', value: ['2018/01/01 14:50:10', 44] },
  { name: '2018/01/01 15:50:10', value: ['2018/01/01 15:50:10', 38] },
  { name: '2018/01/01 16:50:10', value: ['2018/01/01 16:50:10', 32] }
]
// x轴坐标数据
var xData = [
  { name: '2018/01/01 00:00:00', value: ['2018/01/01 00:00:00', 0] },
  { name: '2018/01/01 00:00:00', value: ['2018/01/01 23:59:59', 0] }
]

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    serverId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))

      this.chart.setOption({
        backgroundColor: '#394056',
        title: {
          top: 20,
          text: '服务端资源消耗实时显示',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#F1F1F3'
          },
          left: '1%'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B'
            }
          }
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ['CMCC'],
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#F1F1F3'
          }
        },
        grid: {
          top: 100,
          left: '2%',
          right: '2%',
          bottom: '2%',
          containLabel: true
        },
        xAxis: [{
          type: 'time',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          splitNumber: 7, // 可以通过它控制x轴显示的坐标轴的数量
          splitLine: {
            show: false
          },
          axisLabel: {
            textStyle: {
              fontSize: 14,
              color: 'white'
            }
          }
        }],
        yAxis: [{
          type: 'value',
          name: '(%)',
          axisTick: {
            show: false
          },
          boundaryGap: [0, '100%'],
          axisLine: {
            lineStyle: {
              color: '#57617B'
            }
          },
          axisLabel: {
            margin: 10,
            textStyle: {
              fontSize: 14
            }
          },
          splitLine: {
            lineStyle: {
              color: '#57617B'
            }
          }
        }],
        series: [{
          name: 'CMCC',
          type: 'line',
          symbolSize: 10,
          showSymbol: false,
          hoverAnimation: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(137, 189, 27, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(137, 189, 27, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(137,189,27)',
              borderColor: 'rgba(137,189,2,0.27)',
              borderWidth: 12

            }
          },
          data: data
        }, {
          type: 'line',
          showSymbol: false,
          data: xData,
          itemStyle: { normal: { opacity: 0 }},
          lineStyle: { normal: { opacity: 0 }}
        }]
      })
    }
  }
}
</script>
