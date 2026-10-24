<script setup>
import { ref } from 'vue';
import '../../storyboard.css';
import UiButton from '../components/UiButton.vue';
import UiPanel from '../components/UiPanel.vue';
import { useThemeStore } from '../stores/theme.js';
import { useToastStore } from '../stores/toast.js';
const theme = useThemeStore();
const toast = useToastStore();
const selected = ref('overview');
const dialog = ref(null);
const colors = ['--bg', '--bg2', '--bg3', '--bg4', '--fg', '--dim', '--accent', '--line'];
function moveTab(event) {
  const tabs = ['overview', 'details'];
  const current = tabs.indexOf(selected.value);
  const next =
    event.key === 'ArrowRight'
      ? (current + 1) % tabs.length
      : event.key === 'ArrowLeft'
        ? (current + tabs.length - 1) % tabs.length
        : event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? tabs.length - 1
            : current;
  if (next === current) return;
  event.preventDefault();
  selected.value = tabs[next];
  event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[next]?.focus();
}
</script>
<template>
  <div class="mx-auto grid w-full max-w-5xl gap-6 px-4 py-8 sm:px-8 storyboard">
    <div>
      <h1 class="storyboard__title">Component storyboard</h1>
      <p class="mb-7 max-w-prose text-muted">
        Interactive examples for the reusable controls, all using the active theme tokens.
      </p>
    </div>
    <UiPanel title="Buttons and badges"
      ><div class="flex flex-wrap items-center gap-2">
        <UiButton variant="primary">Primary</UiButton><UiButton>Default</UiButton
        ><UiButton variant="quiet">Quiet</UiButton><UiButton disabled>Disabled</UiButton
        ><span class="badge">Neutral</span><span class="badge badge--success">Success</span
        ><span class="badge badge--warning">Warning</span><kbd class="keycap">⌘ K</kbd>
      </div></UiPanel
    >
    <UiPanel title="Form controls"
      ><div class="grid gap-4">
        <label class="field"
          ><span class="field__label">Text field</span
          ><input class="input" placeholder="Type something" /></label
        ><label class="field"
          ><span class="field__label">Theme</span
          ><select
            class="select"
            :value="theme.activeTheme"
            @change="theme.setTheme($event.target.value)"
          >
            <option v-for="item in theme.themes" :key="item.id" :value="item.id">
              {{ item.name }}
            </option>
          </select></label
        ><label class="flex flex-wrap items-center gap-2"
          ><input class="checkbox" type="checkbox" /> Enable this option</label
        >
      </div></UiPanel
    >
    <UiPanel title="Tabs"
      ><div class="tabs" role="tablist" aria-label="Example tabs">
        <button
          v-for="id in ['overview', 'details']"
          :key="id"
          :id="`tab-${id}`"
          class="tabs__tab"
          role="tab"
          aria-controls="example-tabpanel"
          :aria-selected="selected === id"
          :tabindex="selected === id ? 0 : -1"
          @click="selected = id"
          @keydown="moveTab"
        >
          {{ id }}
        </button>
      </div>
      <p
        id="example-tabpanel"
        class="storyboard__note"
        role="tabpanel"
        :aria-labelledby="`tab-${selected}`"
        tabindex="0"
      >
        {{ selected === 'overview' ? 'An overview panel.' : 'A second tab panel.' }}
      </p></UiPanel
    >
    <UiPanel title="Dialog and popover"
      ><div class="flex flex-wrap items-center gap-2">
        <UiButton @click="dialog.showModal()">Open dialog</UiButton
        ><UiButton popovertarget="example-popover">Open popover</UiButton>
        <div id="example-popover" class="popover" popover>
          <button class="popover__item" popovertarget="example-popover" popovertargetaction="hide">
            Popover item
          </button>
        </div>
        <dialog ref="dialog" class="dialog" aria-labelledby="native-dialog-title">
          <form method="dialog">
            <header class="dialog__header">
              <h2 id="native-dialog-title" class="dialog__title">Native dialog</h2>
            </header>
            <div class="dialog__body"><p>Accessible modal behavior comes from the browser.</p></div>
            <footer class="dialog__footer">
              <UiButton variant="primary" type="submit">Close</UiButton>
            </footer>
          </form>
        </dialog>
      </div></UiPanel
    >
    <UiPanel title="Toast"
      ><div class="flex flex-wrap items-center gap-2">
        <UiButton @click="toast.show('Everything is saved.', 'success')">Success</UiButton
        ><UiButton @click="toast.show('Check the form values.', 'warning')">Warning</UiButton
        ><UiButton @click="toast.show('The request failed.', 'error')">Error</UiButton>
      </div></UiPanel
    >
    <UiPanel title="Theme tokens"
      ><div class="storyboard__tokens">
        <div v-for="token in colors" :key="token" class="storyboard__swatch">
          <div class="storyboard__sample" :style="{ background: `var(${token})` }"></div>
          <code class="storyboard__token">{{ token }}</code>
        </div>
      </div></UiPanel
    >
  </div>
</template>
