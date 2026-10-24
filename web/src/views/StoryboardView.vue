<script setup>
import { ref } from 'vue';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UiButton from '../components/UiButton.vue';
import UiPanel from '../components/UiPanel.vue';
import { useThemeStore } from '../stores/theme.js';
import { useToastStore } from '../stores/toast.js';

const theme = useThemeStore();
const toast = useToastStore();
const selected = ref('overview');
const dialogOpen = ref(false);
const popoverOpen = ref(false);
const colors = ['--bg', '--bg2', '--bg3', '--bg4', '--fg', '--dim', '--accent', '--line'];
</script>

<template>
  <div class="mx-auto grid w-full max-w-5xl gap-6 px-4 py-8 sm:px-8">
    <div>
      <h1 class="mb-2 text-2xl font-semibold tracking-tight">Component storyboard</h1>
      <p class="mb-1 max-w-prose text-muted-foreground">
        shadcn-vue components styled with the template's current theme tokens.
      </p>
    </div>

    <UiPanel title="Buttons and badges">
      <div class="flex flex-wrap items-center gap-2">
        <UiButton variant="primary">Primary</UiButton>
        <UiButton>Default</UiButton>
        <UiButton variant="quiet">Quiet</UiButton>
        <UiButton disabled>Disabled</UiButton>
        <Badge>Neutral</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="destructive">Destructive</Badge>
        <kbd
          class="rounded-sm border border-border bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground"
        >
          ⌘ K
        </kbd>
      </div>
    </UiPanel>

    <UiPanel title="Form controls">
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="grid max-w-sm gap-1.5">
          <Label for="example-input">Text field</Label>
          <Input id="example-input" placeholder="Type something" />
        </div>
        <div class="grid max-w-sm gap-1.5">
          <Label for="example-theme">Theme</Label>
          <Select :model-value="theme.activeTheme" @update:model-value="theme.setTheme($event)">
            <SelectTrigger id="example-theme" class="w-full">
              <SelectValue placeholder="Choose a theme" />
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
        <div class="flex items-center gap-2">
          <Checkbox id="example-option" />
          <Label for="example-option">Enable this option</Label>
        </div>
      </div>
    </UiPanel>

    <UiPanel title="Tabs">
      <Tabs v-model="selected" class="w-full">
        <TabsList aria-label="Example tabs">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" class="mt-3 text-sm text-muted-foreground">
          An overview panel.
        </TabsContent>
        <TabsContent value="details" class="mt-3 text-sm text-muted-foreground">
          A second tab panel.
        </TabsContent>
      </Tabs>
    </UiPanel>

    <UiPanel title="Dialog and popover">
      <div class="flex flex-wrap items-center gap-2">
        <Dialog v-model:open="dialogOpen">
          <DialogTrigger as-child>
            <UiButton>Open dialog</UiButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Accessible dialog</DialogTitle>
              <DialogDescription>
                Reka UI handles focus, keyboard behavior, and dismissal.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose as-child>
                <UiButton variant="primary">Close</UiButton>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Popover v-model:open="popoverOpen">
          <PopoverTrigger as-child>
            <UiButton>Open popover</UiButton>
          </PopoverTrigger>
          <PopoverContent class="w-48">
            <UiButton variant="quiet" class="w-full justify-start" @click="popoverOpen = false">
              Popover item
            </UiButton>
          </PopoverContent>
        </Popover>
      </div>
    </UiPanel>

    <UiPanel title="Status and toast">
      <div class="grid gap-4">
        <Alert>
          <AlertTitle>Theme-aware status</AlertTitle>
          <AlertDescription>
            The shadcn-vue semantic colors resolve through the selected palette.
          </AlertDescription>
        </Alert>
        <div class="flex flex-wrap items-center gap-2">
          <UiButton @click="toast.show('Everything is saved.', 'success')">Success toast</UiButton>
          <UiButton @click="toast.show('Check the form values.', 'warning')"
            >Warning toast</UiButton
          >
          <UiButton @click="toast.show('The request failed.', 'error')">Error toast</UiButton>
        </div>
      </div>
    </UiPanel>

    <UiPanel title="Theme tokens">
      <div class="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(10rem,1fr))]">
        <div
          v-for="token in colors"
          :key="token"
          class="overflow-hidden rounded-md border border-border"
        >
          <div class="h-16 border-b border-border" :style="{ background: `var(${token})` }"></div>
          <code class="block px-2.5 py-2 text-sm text-foreground">{{ token }}</code>
        </div>
      </div>
    </UiPanel>
  </div>
</template>
