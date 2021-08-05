/*
 * @Author: Lvhz
 * @Date: 2021-04-13 15:14:37
 * @Description: Description
 */
import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

// 图表路由
const chartTypeRouteList = [
  {
    path: '/chart/column',
    component: () => import('@view/Chart/Column/index.vue'),
    meta: {
      type: 'chart',
      title: '柱状图',
      icon: 'el-icon-s-data'
    }
  },
  {
    path: '/chart/line',
    component: () => import('@view/Chart/Line/index.vue'),
    meta: {
      type: 'chart',
      title: '折线图',
      icon: 'el-icon-s-marketing'
    }
  },
  {
    path: '/chart/pie',
    component: () => import('@view/Chart/Pie/index.vue'),
    meta: {
      type: 'chart',
      title: '饼图',
      icon: 'el-icon-pie-chart'
    }
  },
  {
    path: '/chart/other',
    component: () => import('@view/Chart/Other/index.vue'),
    meta: {
      type: 'chart',
      title: '其他图'
    }
  }
];

// 规范路由
const standardTypeRouteList = [
  {
    path: '/standard/chart-standard',
    component: () => import('@view/Standard/ChartStandard/index.vue'),
    meta: {
      type: 'standard',
      title: '可视化图表规范',
      icon: 'el-icon-pie-chart'
    }
  }
];

export const routes = [
  ...chartTypeRouteList,
  ...standardTypeRouteList,
  {
    path: '/baidu-map',
    component: () => import('@view/Map/Baidu/index.vue')
  },
  {
    path: '*',
    redirect: '/chart/column'
  }
];

const router = new VueRouter({
  mode: 'history',
  // base: process.env.BASE_URL,
  routes
});

export default router;
