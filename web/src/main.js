import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import './style.css';
import App from './App.vue';
import HomeView from './views/HomeView.vue';
import StateView from './views/StateView.vue';
import NotFoundView from './views/NotFoundView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/state', name: 'state', component: StateView },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
];

const router = createRouter({ history: createWebHistory(), routes });

if (import.meta.env.DEV) {
  const { default: StoryboardView } = await import('./views/StoryboardView.vue');
  router.addRoute({ path: '/dev/components', name: 'components', component: StoryboardView });
}

createApp(App).use(createPinia()).use(router).mount('#app');
