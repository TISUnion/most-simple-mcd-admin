<template>

  <div v-loading="loading" class="app-contaniner">
    <h4>服务端 {{ serverName }} 资源消耗实时显示</h4>
    <div id="percent" :style="{height:height,width:width}" />
    <el-divider />
    <div id="area" :style="{height:height,width:width}" />
  </div>
</template>

<script>
import echarts from 'echarts'
import resize from './resize'
import { parseTime } from '@/utils/index'
import { getConfigVal } from '@/api/server'
export default {
  mixins: [resize],
  props: {
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
    },
    serverName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      percentChart: null,
      areaChart: null,
      rWebsocket: null,
      loading: true,
      wsHost: ''
    }
  },
  mounted() {
    this.initChart()
    this.initWebsocket()
  },
  beforeDestroy() {
    if (this.percentChart) {
      this.percentChart.dispose()
      this.percentChart = null
    }
    if (this.areaChart) {
      this.areaChart.dispose()
      this.areaChart = null
    }
    if (this.rWebsocket) {
      this.rWebsocket.close()
      this.rWebsocket = null
    }
  },
  methods: {
    async initParam() {
      await getConfigVal({ name: 'websocket_host' }).then(Response => {
        this.wsHost = Response.data.config_val
      })
    },
    initChart() {
      this.percentChart = echarts.init(document.getElementById('percent'))
      this.areaChart = echarts.init(document.getElementById('area'))
    },
    async initWebsocket() {
      await this.initParam()
      if (typeof (WebSocket) === 'undefined') {
        this.$message({
          message: '您的浏览器不支持该功能',
          type: 'warning'
        })
        return
      }
      this.rWebsocket = new WebSocket(`ws://${this.wsHost}/server/resources/listen?id=${this.serverId}`)
      const data = { cpuUsedPercent: [], memoryUsedPercent: [], memoryUsed: [] }
      this.rWebsocket.onmessage = (e) => {
        const now = parseTime(new Date(), '{y}/{m}/{d} {h}:{i}:{s}')
        const redata = JSON.parse(e.data)
        data.cpuUsedPercent.push({ name: now, value: [now, redata.cpu_used_percent] })
        data.memoryUsedPercent.push({ name: now, value: [now, redata.memory_used_percent] })
        data.memoryUsed.push({ name: now, value: [now, redata.memory_used / 1024 / 1024] })
        this.percentChart.setOption(this.setPercentOption(data))
        this.areaChart.setOption(this.setAreaOption(data))
      }
      this.rWebsocket.onopen = () => {
        this.rWebsocket.send(this.$store.state.user.token) // 发送校验token
        this.$message({
          message: '连接成功！',
          type: 'success'
        })
        this.loading = false
      }
    },
    setPercentOption(data) {
      return {
        backgroundColor: '#394056',
        title: {
          top: 20,
          text: 'CPU与内存占用比',
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
          data: ['cpu占用比', '内存占用比'],
          right: '4%',
          textStyle: {
            fontSize: 15,
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
          name: 'cpu占用比',
          type: 'line',
          symbolSize: 2,
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
          data: data.cpuUsedPercent
        }, {
          name: '内存占用比',
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 2,
          showSymbol: false,
          lineStyle: {
            normal: {
              width: 1
            }
          },
          areaStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: 'rgba(0, 136, 212, 0.3)'
              }, {
                offset: 0.8,
                color: 'rgba(0, 136, 212, 0)'
              }], false),
              shadowColor: 'rgba(0, 0, 0, 0.1)',
              shadowBlur: 10
            }
          },
          itemStyle: {
            normal: {
              color: 'rgb(0,136,212)',
              borderColor: 'rgba(0,136,212,0.2)',
              borderWidth: 12

            }
          },
          data: data.memoryUsedPercent
        }]
      }
    },
    setAreaOption(data) {
      return {
        backgroundColor: '#394056',
        title: {
          top: 20,
          text: '内存使用空间',
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
          data: ['内存占用空间'],
          right: '4%',
          textStyle: {
            fontSize: 15,
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
          name: '(MB)',
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
          name: '内存占用空间',
          type: 'line',
          symbolSize: 2,
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
          data: data.memoryUsed
        }]
      }
    }
  }
}
</script>
