import { createRouter, RouteRecordRaw, createWebHashHistory } from "vue-router";
const routes: Array<RouteRecordRaw> = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/components/userLogin.vue"),
  },
  {
    path: "/",
    name: "Home",
    component: () => import("@/components/home.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.path == "/login") {
    if (to.query?.token) {
      localStorage.setItem("Authorization", to.query.token as string);
      next("/");
    }
    next();
  } else {
    if (localStorage.getItem("Authorization")) {
      next();
    } else {
      next("/login");
    }
  }
});
export default router;
