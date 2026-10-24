<script setup>
import { ref } from 'vue';
import { api } from '../api.js';
import UiButton from '../components/UiButton.vue';
import UiPanel from '../components/UiPanel.vue';
import { useToastStore } from '../stores/toast.js';
const result = ref('Ready.');
const loading = ref(false);
const toast = useToastStore();
async function callApi() {
  loading.value = true;
  result.value = 'Loading…';
  try {
    const data = await api('/api/hello', { signal: AbortSignal.timeout(10000) });
    result.value = data.message;
  } catch (error) {
    result.value = error.message || 'Could not reach the server.';
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <div class="mx-auto grid w-full max-w-5xl gap-6 px-4 py-8 sm:px-8">
    <div>
      <h1 class="mb-2 text-2xl font-semibold tracking-tight">A small place to start.</h1>
      <p class="mb-7 max-w-prose text-muted-foreground">
        A Go server, a Vue client, and reusable UI building blocks.
      </p>
    </div>
    <UiPanel title="Client meets server">
      <div class="grid gap-4">
        <p>Call the Go JSON endpoint from this Vue page.</p>
        <div class="flex flex-wrap items-center gap-2">
          <UiButton variant="primary" :disabled="loading" @click="callApi">{{
            loading ? 'Calling…' : 'Call the API'
          }}</UiButton
          ><UiButton @click="toast.show('The shared toast store is working.', 'success')"
            >Show toast</UiButton
          >
        </div>
        <output
          class="block w-full rounded-md border border-border bg-muted/40 px-3 py-2 font-mono text-sm text-foreground"
          aria-live="polite"
          >{{ result }}</output
        >
      </div>
    </UiPanel>
  </div>
</template>
