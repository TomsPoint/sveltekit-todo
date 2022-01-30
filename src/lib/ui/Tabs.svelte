<script lang="ts">
  import { writable } from "svelte/store";
  import { browser } from "$app/env";
  import type { Tabs } from "$lib/interface";

  export let active;
  export let tabs: Tabs;
  const activeTabName = `active-tab-${tabs.name}`;

  export const tabActive = writable((browser && JSON.parse(localStorage.getItem(activeTabName))) || active);
  tabActive.subscribe((x) => browser && localStorage.setItem(activeTabName, JSON.stringify(x)));
  $: active = $tabActive;

  const updateTab = (tab) => tabActive.set(tab);
</script>

<div class="p-4">
  <ul class="flex gap-8 mb-4 w-full">
    {#each tabs.tabs as tab}
      <li class:active={tab === $tabActive} on:click={() => updateTab(tab)}>{tab}</li>
    {/each}
  </ul>
  <div class="p-4 ">
    <slot><!-- optional fallback --></slot>
  </div>
</div>

<style lang="postcss">
  li {
    @apply cursor-pointer hover:border-b-gray-400 hover:border-b-2 text-xl;
    &.active {
      @apply border-b-2 border-b-yellow-400;
    }
  }
</style>
