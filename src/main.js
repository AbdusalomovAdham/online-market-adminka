import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import { createPinia } from "pinia";

const pinia = createPinia();

import "@/assets/font/stylesheet.css";
import "@/assets/scss/main.scss";

import "primevue/resources/primevue.min.css";
import "primevue/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";

createApp(App).use(PrimeVue).use(router).use(pinia).use(PrimeVue).mount("#app");
