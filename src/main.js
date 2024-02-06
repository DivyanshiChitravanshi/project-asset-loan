import { createApp } from "vue";
import App from "./App.vue";
import NavBar from "./components/NavBar.vue";
import ShowTransaction from "./components/ShowTransaction.vue";

const app = createApp(App);

app.component("nav-bar", NavBar);
app.component("show-transaction", ShowTransaction);
app.mount("#app");
