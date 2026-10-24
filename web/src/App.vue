<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { MenuIcon } from '@lucide/vue';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
    class="grid h-dvh overflow-hidden grid-rows-[48px_minmax(0,1fr)_26px] max-[700px]:grid-cols-[minmax(0,1fr)] max-[700px]:grid-rows-[48px_auto_minmax(0,1fr)_26px]"
    :class="
      sidebarOpen
        ? 'grid-cols-[var(--sidebar-width)_4px_minmax(0,1fr)]'
        : 'grid-cols-[minmax(0,1fr)]'
    "
    :style="{ '--sidebar-width': `${sidebarWidth}px` }"
  >
    <header
      class="col-span-full row-start-1 flex items-center gap-3 border-b border-border bg-card px-4"
    >
      <Button
        variant="ghost"
        size="icon"
        type="button"
        aria-controls="sidebar"
        :aria-expanded="sidebarOpen"
        aria-label="Toggle sidebar"
        @click="sidebarOpen = !sidebarOpen"
      >
        <MenuIcon />
      </Button>
      <RouterLink class="hidden font-semibold text-foreground no-underline sm:block" to="/">
        Go web template
      </RouterLink>
      <Badge variant="outline" aria-label="Shared counter">Count {{ counter.count }}</Badge>
      <div class="ml-auto flex items-center gap-2">
        <label class="sr-only" for="theme-select">Theme</label>
        <Select :model-value="theme.activeTheme" @update:model-value="theme.setTheme($event)">
          <SelectTrigger id="theme-select" class="h-8 w-[min(11rem,35vw)]">
            <SelectValue placeholder="Choose theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem v-for="item in theme.themes" :key="item.id" :value="item.id">
                {{ item.name }}
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </header>

    <aside
      v-show="sidebarOpen"
      id="sidebar"
      class="col-start-1 row-start-2 flex min-h-0 flex-col overflow-auto border-r border-border bg-card max-[700px]:row-start-2 max-[700px]:max-h-[35dvh] max-[700px]:border-r-0 max-[700px]:border-b"
      aria-label="Sidebar"
    >
      <div class="px-3 pt-4 pb-2 text-xs font-semibold text-muted-foreground">Application</div>
      <nav class="grid gap-0.5 px-2" aria-label="Main navigation">
        <RouterLink
          class="rounded-sm px-2.5 py-2 text-sm text-muted-foreground no-underline hover:bg-muted hover:text-foreground aria-[current=page]:bg-muted aria-[current=page]:text-foreground"
          to="/"
          :aria-current="isHome ? 'page' : undefined"
        >
          Home
        </RouterLink>
        <RouterLink
          class="rounded-sm px-2.5 py-2 text-sm text-muted-foreground no-underline hover:bg-muted hover:text-foreground aria-[current=page]:bg-muted aria-[current=page]:text-foreground"
          to="/state"
          :aria-current="route.name === 'state' ? 'page' : undefined"
        >
          Shared state
        </RouterLink>
        <RouterLink
          v-if="isDevelopment"
          class="rounded-sm px-2.5 py-2 text-sm text-muted-foreground no-underline hover:bg-muted hover:text-foreground aria-[current=page]:bg-muted aria-[current=page]:text-foreground"
          to="/dev/components"
          :aria-current="route.name === 'components' ? 'page' : undefined"
        >
          Components
        </RouterLink>
      </nav>
      <div class="mt-auto border-t border-border p-3">
        <Badge variant="secondary">Vue + Go</Badge>
      </div>
    </aside>

    <div
      v-show="sidebarOpen"
      ref="resize"
      class="col-start-2 row-start-2 w-1 cursor-col-resize touch-none hover:bg-accent focus-visible:bg-accent max-[700px]:hidden"
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

    <main
      id="main-content"
      class="min-w-0 overflow-auto bg-background"
      :class="
        sidebarOpen
          ? 'col-start-3 row-start-2 max-[700px]:col-start-1 max-[700px]:row-start-3'
          : 'col-span-full row-start-2 max-[700px]:row-start-2'
      "
    >
      <RouterView />
    </main>
    <footer
      class="col-span-full row-start-3 flex items-center border-t border-border bg-card px-3 text-xs text-muted-foreground"
      :class="sidebarOpen ? 'max-[700px]:row-start-4' : 'max-[700px]:row-start-3'"
    >
      Ready
    </footer>
    <ToastHost />
  </div>
</template>
