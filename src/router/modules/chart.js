/*
 * @Author: Lvhz
 * @Date: 2021-09-03 11:07:30
 * @Description: 图表组件
 */
import Layout from '@/layout'

const componentsRouter = {
  path: '/chart-comp',
  component: Layout,
  name: 'ChartComp',
  meta: {
    title: '图表组件',
    icon: 'chart'
  },
  children: [
    {
      path: 'column',
      component: () => import('@/views/Chart/Column'),
      name: 'Column',
      meta: { title: '柱状图' }
    },
    {
      path: 'line',
      component: () => import('@/views/Chart/Line'),
      name: 'Line',
      meta: { title: '折线图' }
    },
    {
      path: 'pie',
      component: () => import('@/views/Chart/Pie'),
      name: 'Pie',
      meta: { title: '饼图' }
    },
    {
      path: 'other',
      component: () => import('@/views/Chart/Other'),
      name: 'Other',
      meta: { title: '其他图' }
    },
    {
      path: 'screen',
      component: () => import('@/views/Chart/Screen'),
      name: 'Screen',
      meta: { title: '大屏组件' }
    },
  ]
}

export default componentsRouter