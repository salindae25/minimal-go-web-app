import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPinia, setActivePinia, disposePinia } from 'pinia';
import { useCounterStore } from '../src/stores/counter.js';
import { useToastStore } from '../src/stores/toast.js';

test('shared counter instances retain state, fresh applications start clean', () => {
  const pinia = createPinia();
  setActivePinia(pinia);
  const first = useCounterStore();
  first.increment();
  first.increment();
  assert.equal(useCounterStore().count, 2);
  first.decrement();
  assert.equal(first.count, 1);
  first.reset();
  assert.equal(first.count, 0);
  setActivePinia(createPinia());
  assert.equal(useCounterStore().count, 0);
  disposePinia(pinia);
});

test('notifications replace previous state and clear their lifecycle', () => {
  const pinia = createPinia();
  setActivePinia(pinia);
  const toast = useToastStore();
  toast.show('First', 'info');
  toast.show('Second', 'error');
  assert.equal(toast.message, 'Second');
  assert.equal(toast.tone, 'error');
  assert.equal(toast.visible, true);
  toast.clear();
  assert.equal(toast.visible, false);
  disposePinia(pinia);
});
