import { defineStore } from 'pinia';
import { onScopeDispose, ref } from 'vue';

export const useToastStore = defineStore('toast', () => {
  const message = ref('');
  const tone = ref('info');
  const visible = ref(false);
  let timer;
  function clear() {
    clearTimeout(timer);
    visible.value = false;
  }
  function show(text, kind = 'info', duration = 2800) {
    clear();
    message.value = text;
    tone.value = kind;
    visible.value = true;
    timer = setTimeout(() => {
      visible.value = false;
    }, duration);
  }
  onScopeDispose(clear);
  return { message, tone, visible, show, clear };
});
