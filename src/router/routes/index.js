const routes = [
  {
    path: "/auth",
    component: () => import("@/layouts/auth"),
    name: "auth-layout",
    children: [
      {
        path: "sign-in",
        component: () => import("@/pages/auth/sign-in"),
      },
    ],
  },
  {
    path: "/cabinet",
    component: () => import("@/layouts/default"),
    name: "default-layout",
    children: [
      {
        path: "admin",
        name: "cabinet-admin",
        children: [
          {
            path: "home",
            component: () => import("@/pages/cabinet/admin"),
            name: "cabinet-admin-home",
          },
          {
            path: "users",
            component: () => import("@/pages/cabinet/admin/users"),
            name: "cabinet-admin-users",
          },
          {
            path: "users/create",
            component: () => import("@/pages/cabinet/admin/users/Create"),
            name: "cabinet-admin-users-create",
          },
          {
            path: "users/update/:id",
            component: () => import("@/pages/cabinet/admin/users/update/[id]"),
            name: "cabinet-admin-users-update",
          },
          {
            path: "online-devices",
            component: () => import("@/pages/cabinet/admin/online-devices"),
            name: "cabinet-admin-online-devices",
          },
          {
            path: "devices",
            component: () => import("@/pages/cabinet/admin/devices"),
            name: "cabinet-admin-devices",
          },
          {
            path: "devices/:id/activities",
            component: () =>
              import("@/pages/cabinet/admin/devices/[id]/activities"),
            name: "cabinet-admin-device-activities",
          },
          {
            path: "statistics",
            component: () => import("@/pages/cabinet/admin/statistics"),
            name: "cabinet-admin-statistics",
          },
          {
            path: "programs",
            component: () => import("@/pages/cabinet/admin/programs"),
            name: "cabinet-admin-programs",
          },
          {
            path: "products",
            component: () => import("@/pages/cabinet/admin/products"),
            name: "cabinet-admin-products",
          },
          {
            path: "products/create",
            component: () => import("@/pages/cabinet/admin/products/create"),
            name: "cabinet-admin-products-create",
          },
          {
            path: "products/update/:id",
            component: () => import("@/pages/cabinet/admin/products/update"),
            name: "cabinet-admin-products-update",
          },
          {
            path: "wishlists",
            component: () =>
              import("@/pages/cabinet/admin/wishlists/wishlists.vue"),
            name: "cabinet-admin-wishlists",
          },
          {
            path: "category",
            component: () =>
              import("@/pages/cabinet/admin/category/category.vue"),
            name: "cabinet-admin-category",
          },
          {
            path: "category/param",
            component: () =>
              import("@/pages/cabinet/admin/category/category-param.vue"),
            name: "cabinet-admin-category-param",
          },
          {
            path: "category/param/value",
            component: () =>
              import("@/pages/cabinet/admin/category/category-param-value.vue"),
            name: "cabinet-admin-category-param-value",
          },
        ],
      },
    ],
  },
];

export default routes;
