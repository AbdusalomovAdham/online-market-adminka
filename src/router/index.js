import { createWebHistory, createRouter } from "vue-router";
import routes from "./routes";

// const router = createRouter({
//   history: createWebHashHistory(),
//   routes,
// });

// router.beforeEach((to, from, next) => {
//   const token = localStorage.getItem("token");
//   const role = localStorage.getItem("role");

//   if (to.path !== "/auth/sign-in" && from.path !== "/auth/sign-in" && !token) {
//     next("/auth/sign-in");
//     return;
//   }

//   if (to.path === "/" && from.path === "/" && !token) {
//     next("/auth/sign-in");
//     return;
//   }

//   next();
// });

// export default router;

// import { createWebHistory, createRouter } from "vue-router";
// import routes from "./routes";

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token");
  const publicPages = ["/auth/sign-in", "/auth/sign-up"];
  const authRequired = !publicPages.includes(to.path);

  // 1) If user lands on root '/', redirect based on token presence
  // if (to.path === "/") {
  //   if (token) {
  //     if (from.path === "/cabinet/admin" || to.path === "/cabinet/admin") {
  //       return next();
  //     }
  //     return next("/cabinet/admin");
  //   } else {
  //     if (to.path === "/auth/sign-in") return next();
  //     return next("/auth/sign-in");
  //   }
  // }

  // // 2) If user has token and tries to access auth pages, send to cabinet page
  // if (token && publicPages.includes(to.path)) {
  //   return next("/cabinet/admin");
  // }

  // // 3) Exception: allow access even without token
  // if (!token && isException) {
  //   return next();
  // }

  // // 4) If user doesn't have token and tries to access a protected page, send to sign-in
  // if (!token && authRequired) {
  //   return next("/auth/sign-in");
  // }

  // otherwise allow navigation
  next();
});

export default router;
