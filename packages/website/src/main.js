/*
 * @Author: Lvhz
 * @Date: 2021-09-23 15:30:15
 * @Description: Description
 */
// import { createApp } from "vue";
// import App from "./App.vue";
// import router from "./router";
// // import * as Element3 from "element-plus";
// import ElementUI from "element-plus";

// import "./assets/styles/common.scss";

// const app = createApp(App);
// app.use(router);
// app.use(ElementUI);

// // 方便在 demo 里面全局导入 element3
// // window.Element3 = ElementUI;

// router.isReady().then(() => {
//   app.mount("#app");
// });

import { createApp, reactive } from "vue";
import EntryApp from "./App";

import { createRouter, createWebHashHistory } from "vue-router";
import * as Element3 from "element3";
import routes from "./router";
// import demoBlock from "./components/demo-block";
import MainHeader from "./components/main-header";
// import SideNav from "./components/side-nav";
// import FooterNav from "./components/footer-nav";
import title from "./i18n/title";

// import 'element3/lib/theme-chalk/index.css'
import "./demo-styles/index.scss";
import "./assets/styles/common.scss";
import "./assets/styles/fonts/style.css";
import icon from "./icon.json";

const app = createApp(EntryApp);
app.use(Element3);

// app.component("demo-block", demoBlock);
app.component("main-header", MainHeader);
// app.component("side-nav", SideNav);
// app.component("footer-nav", FooterNav);

const globalEle = reactive({
  data: { $isEle: false }, // 是否 ele 用户
});

// 方便在 demo 里面全局导入 element3
window.Element3 = Element3;

app.mixin({
  computed: {
    $isEle: {
      get: () => globalEle.data.$isEle,
      set: (data) => {
        globalEle.data.$isEle = data;
      },
    },
  },
});
app.config.globalProperties.$icon = icon;

const router = createRouter({
  history: createWebHashHistory(__dirname),
  routes,
});
app.use(router);

router.isReady().then(() => {
  router.afterEach(async (route) => {
    const data = title;
    for (const val in data) {
      if (new RegExp("^" + val, "g").test(route.name)) {
        document.title = data[val];
        return;
      }
    }
    document.title = "Element";
  });
  app.mount("#app");
});

export default app;
