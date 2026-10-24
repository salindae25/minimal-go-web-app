<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { useCounterStore } from './stores/counter.js';
import { useThemeStore } from './stores/theme.js';
import { useToastStore } from './stores/toast.js';
import ToastHost from './components/ToastHost.vue';

const isDevelopment = import.meta.env.DEV;
const route = useRoute();
const counter = useCounterStore();
const theme = useThemeStore();
const toast = useToastStore();
const sidebarOpen = ref(window.matchMedia('(min-width: 701px)').matches);
const sidebarWidth = ref(240);
const shell = ref(null);
const resize = ref(null);
const isHome = computed(() => route.name === 'home');
let dragCleanup;

function setSidebarWidth(width) {
  sidebarWidth.value = Math.min(400, Math.max(180, width));
}
function onResizeKey(event) {
  const delta = event.shiftKey ? 40 : 10;
  if (event.key === 'ArrowLeft') setSidebarWidth(sidebarWidth.value - delta);
  else if (event.key === 'ArrowRight') setSidebarWidth(sidebarWidth.value + delta);
  else if (event.key === 'Home') setSidebarWidth(180);
  else if (event.key === 'End') setSidebarWidth(400);
  else return;
  event.preventDefault();
}
function startResize(event) {
  if (event.button !== 0 || window.matchMedia('(max-width: 700px)').matches) return;
  dragCleanup?.();
  event.preventDefault();
  const startX = event.clientX;
  const initialWidth = sidebarWidth.value;
  resize.value?.setPointerCapture(event.pointerId);
  const move = (moveEvent) => setSidebarWidth(initialWidth + moveEvent.clientX - startX);
  const end = () => {
    resize.value?.removeEventListener('pointermove', move);
    resize.value?.removeEventListener('pointerup', end);
    resize.value?.removeEventListener('pointercancel', end);
    dragCleanup = undefined;
  };
  resize.value?.addEventListener('pointermove', move);
  resize.value?.addEventListener('pointerup', end);
  resize.value?.addEventListener('pointercancel', end);
  dragCleanup = end;
}
function onKeydown(event) {
  if (event.key === 'Escape' && window.matchMedia('(max-width: 700px)').matches)
    sidebarOpen.value = false;
}
onMounted(() => {
  theme.initialize();
  document.addEventListener('keydown', onKeydown);
});
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown);
  dragCleanup?.();
  toast.clear();
});
</script>

<template>
  <div
    ref="shell"
    class="app-shell min-h-screen"
    :class="{ 'app-shell--sidebar-hidden': !sidebarOpen }"
    :style="{ '--sidebar-width': `${sidebarWidth}px` }"
  >
    <header class="app-shell__header flex items-center gap-3 px-4">
      <button
        class="button button--icon"
        type="button"
        aria-controls="sidebar"
        :aria-expanded="sidebarOpen"
        aria-label="Toggle sidebar"
        @click="sidebarOpen = !sidebarOpen"
      >
        ☰
      </button>
      <RouterLink class="app-shell__title hidden no-underline sm:block" to="/"
        >Go web template</RouterLink
      >
      <span class="badge" aria-label="Shared counter">Count {{ counter.count }}</span>
      <div class="app-shell__actions">
        <label class="sr-only" for="theme-select">Theme</label>
        <select
          id="theme-select"
          class="select select--compact"
          :value="theme.activeTheme"
          @change="theme.setTheme($event.target.value)"
        >
          <option v-for="item in theme.themes" :key="item.id" :value="item.id">
            {{ item.name }}
          </option>
        </select>
      </div>
    </header>
    <aside v-show="sidebarOpen" id="sidebar" class="sidebar" aria-label="Sidebar">
      <div class="sidebar__heading">Application</div>
      <nav class="sidebar__nav" aria-label="Main navigation">
        <RouterLink class="sidebar__link" to="/" :aria-current="isHome ? 'page' : undefined"
          >Home</RouterLink
        >
        <RouterLink
          class="sidebar__link"
          to="/state"
          :aria-current="route.name === 'state' ? 'page' : undefined"
          >Shared state</RouterLink
        >
        <RouterLink
          v-if="isDevelopment"
          class="sidebar__link"
          to="/dev/components"
          :aria-current="route.name === 'components' ? 'page' : undefined"
          >Components</RouterLink
        >
      </nav>
      <div class="sidebar__footer"><span class="badge">Vue + Go</span></div>
    </aside>
    <div
      v-show="sidebarOpen"
      ref="resize"
      class="resize-handle"
      role="separator"
      aria-label="Sidebar width"
      aria-controls="sidebar"
      aria-orientation="vertical"
      :aria-valuenow="sidebarWidth"
      aria-valuemin="180"
      aria-valuemax="400"
      tabindex="0"
      @pointerdown="startResize"
      @keydown="onResizeKey"
    ></div>
    <main id="main-content" class="app-shell__content">
      <RouterView />
    </main>
    <footer class="app-shell__status">Ready</footer>
    <ToastHost />
  </div>
</template>
