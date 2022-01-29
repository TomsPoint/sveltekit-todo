<script lang="ts">
  import { uuid } from "$lib/utils";
  export let readonly = false;
  export let expanded = true;

  interface Item {
    id: string;
    name: string;
    sort_order: number;
  }

  export let item: Item;
  export let items: any[];

  if (items.length === 0) items = [{ id: uuid(), name: "", sort_order: 1 }];

  items = items.sort((a, b) => a.sort_order - b.sort_order);

  const toggle = () => (expanded = !expanded);

  const addSibbling = () => {
    items = [...items, { id: uuid(), name: "", sort_order: items.length + 1 }];
  };

  const addChildren = (id) => {
    if (items.length === 0) {
      items = [{ id: uuid(), name: "", sort_order: 1 }];
    } else {
      items.forEach((obj) => {
        if (obj.id === id) {
          if (obj.itmes) {
            obj.items = [...obj.items, { id: uuid(), name: "", sort_order: 1 }];
          } else {
            obj.items = [{ id: uuid(), name: "", sort_order: 1 }];
          }
        }
      });
    }
    items = items;
  };
  const removeItem = (id) => {
    items = items.filter((obj) => obj.id !== id);
  };
</script>

{#if readonly}
  <span class:expanded on:click={toggle}>{item.name}</span>
  {#if items.length === 0}
    <div class="element">
      <span class="add" on:click={() => addChildren(item.id)}>✚</span>
    </div>
  {/if}
{:else}
  <div class="element">
    <span class="toggle" class:expanded on:click={toggle}>{expanded ? "▼" : "▶"}</span>
    <input class="sorter" bind:value={item.sort_order} />
    <input bind:value={item.name} />
  </div>
{/if}
{#if expanded}
  <ul>
    {#each items as item, i}
      <li class="relative">
        {#if item.items && item.items.length > 0}
          <svelte:self bind:item bind:items={item.items} />
        {:else}
          <div class="element relative">
            <span class="add " on:click={() => addChildren(item.id)}>✚</span>
            <input class="sorter" bind:value={item.sort_order} />
            <input bind:value={item.name} />

            <span class="delete" on:click={() => removeItem(item.id)}>☒</span>
          </div>
        {/if}
      </li>
      {#if items.length === 0 || items.length === i + 1}
        <li>
          <div class="element element-last">
            <span class="addSibling" on:click={addSibbling}>✚</span>
          </div>
        </li>
      {/if}
    {/each}
  </ul>
{/if}

<style lang="postcss">
  ul {
    @apply pl-[19px] overflow-hidden;
  }

  .element {
    @apply relative grid gap-1 p-1 place-items-center;
    grid-template-columns: 2rem 2rem 1fr 2rem;
  }
  .element > * {
    z-index: 10;
  }
  .element::before {
    content: "";
    @apply absolute border-t-[1px] top-1/2 left-0 w-[5rem] z-0;
    @apply border-gray-400;
  }
  .element::after {
    content: "";
    @apply absolute border-l-[1px] bottom-1/2 left-0 h-full z-0;
    @apply border-gray-400;
  }
  .element.element-last::before {
    @apply border-gray-200 w-[2.5rem];
  }
  .element.element-last::after {
    @apply border-gray-200  h-[50%];
  }

  li::before {
    content: "";
    @apply absolute border-l-[1px] bottom-0 left-0 top-0 z-0;
  }
  li:last-child::before {
    content: "";
    @apply border-none;
  }

  .add,
  .toggle {
    @apply cursor-pointer z-10 bg-white leading-none text-gray-400;
  }
  .add {
    @apply mt-5 pl-4 text-gray-200 relative;
    transform: translateY(50%);
    &::before {
      content: "";
      top: -9px;
      height: 18px;
      @apply absolute w-1/3 border-l border-b right-1/2;
    }
  }

  .delete {
    @apply cursor-pointer text-2xl text-gray-400;
  }

  .sorter {
    @apply text-center text-gray-400 focus:text-gray-800;
  }

  input {
    @apply bg-gray-100 border-transparent placeholder-gray-500 rounded-sm w-full px-2 py-1;
  }
  .addSibling {
    @apply col-start-2 py-1 ml-1 justify-self-start text-2xl text-gray-200;
  }
</style>
