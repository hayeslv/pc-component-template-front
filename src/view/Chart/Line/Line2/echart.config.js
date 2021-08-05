/*
 * @Author: Lvhz
 * @Date: 2021-04-14 10:20:23
 * @Description: Description
 */
import echarts from 'echarts';

const colorList = ['#3196FA', '#11C372', '#FACC14'];
const nameList = ['上报数（件）'];
// const dataList = [
//   { time: 0, number: 100 },
//   { time: 1, number: 138 },
//   { time: 2, number: 350 },
//   { time: 3, number: 173 },
//   { time: 4, number: 180 },
//   { time: 5, number: 150 },
//   { time: 6, number: 100 },
//   { time: 7, number: 138 },
//   { time: 8, number: 100 },
//   { time: 9, number: 173 },
//   { time: 10, number: 160 }
// ];
// const xAxisDataList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
// const yAxisData = [100, 138, 350, 173, 180, 150, 178, 100, 138, 350, 173, 180, 233, 201, 182, 198, 234, 210, 230, 233, 201, 182, 198, 234];

// hex转换成rgba
const hexToRgba = (hex, opacity) => {
  let rgbaColor = '';
  const reg = /^#[\da-f]{6}$/i;
  if (reg.test(hex)) {
    rgbaColor = `rgba(${parseInt('0x' + hex.slice(1, 3))},${parseInt('0x' + hex.slice(3, 5))},${parseInt('0x' + hex.slice(5, 7))},${opacity})`;
  }
  return rgbaColor;
};

const areaStyle = (index) => {
  return {
    normal: {
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1,
        [{
          offset: 0,
          color: hexToRgba(colorList[index], 0.2)
        }, {
          offset: 1,
          color: hexToRgba(colorList[index], 0)
        }]
      ),
      shadowColor: hexToRgba(colorList[index], 0.1),
      shadowBlur: 10
    }
  };
};

const getDataList = dataList => {
  let xAxisDataList = [], yAxisData = [];
  if (!dataList || !Array.isArray(dataList)) return { xAxisDataList, yAxisData };
  xAxisDataList = dataList.map(item => item.time || 0);
  yAxisData = dataList.map(item => item.number || 0);
  return { xAxisDataList, yAxisData };
};

export const getOption = dataList => {
  const { xAxisDataList, yAxisData } = getDataList(dataList);
  return {
    backgroundColor: 'transparent',
    color: colorList,
    grid: {
      top: '20%',
      left: '15%',
      right: '7%',
      bottom: '30%'
    },
    legend: {
      icon: 'rect',
      itemHeight: 2,
      itemWidth: 16,
      bottom: '0%',
      left: 'center',
      textStyle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line'
      },
      extraCssText: `font-size:14px;line-height:24px;color:rgba(255,255,255,0.65);background:rgba(0,0,0,0.6);box-shadow:0 0 3px rgba(0, 0, 0, 0.2)`,
      formatter: function(params) {
        let html = '';
        html += `
          <div style="font-size:12px;">${params[0].name || 0}时</div>
        `;
        params.forEach(v => {
          html += `
          <div style="display:flex; justify-content: space-between;">
            <div style="display:flex; align-items: center;">
              <span style="display:inline-block;
                margin-right: 6px;
                width: 10px;
                min-width: 10px;
                height: 2px;
                min-height: 2px;
                background-color:${colorList[v.componentIndex]};"
              ></span>
              <span>${v.seriesName}</span>
            </div>
            <span style="font-size:12px;">${v.value}</span>
          </div>
          `;
        });
        return html;
      }
    },
    xAxis: {
      name: '(时)',
      nameTextStyle: {
        fontSize: 12,
        color: '#fff',
        padding: [36, 0, 0, -16]
      },
      data: xAxisDataList,
      axisLabel: {
        textStyle: {
          color: 'rgba(255,255,255,0.65)',
          fontSize: 16
        },
        // formatter: '{value}时'
        formatter: '{value}'
      },
      axisLine: { // 横坐标轴
        lineStyle: {
          color: 'rgba(255,255,255,0.3)'
        }
      },
      axisTick: { // 横坐标轴上的脚标（竖线）
        show: false
      }
    },
    yAxis: {
      name: '(件)',
      nameTextStyle: {
        fontSize: 12,
        color: '#fff',
        padding: [0, 0, 0, -30]
      },
      axisLabel: {
        textStyle: {
          color: 'rgba(255,255,255,0.65)',
          fontSize: 16
        }
      },
      axisLine: { // 竖坐标轴
        show: false
      },
      splitLine: { // 竖坐标出来的线
        show: true,
        lineStyle: {
          color: 'rgba(255,255,255,0.15)',
          type: 'dotted'
        }
      },
      minInterval: 1 // y轴的最小间隔为1
    },
    series: [{
      name: nameList[0],
      type: 'line',
      data: yAxisData,
      smooth: true,
      symbolSize: 2,
      showSymbol: false,
      areaStyle: areaStyle(0)
    }]
  };
};
