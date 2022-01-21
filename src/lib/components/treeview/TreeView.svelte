<script>
  export let readonly = false;
  export let expanded = false;

  export let item;
  export let items;

  function toggle() {
    expanded = !expanded;
  }
</script>

{#if readonly}
  <span class:expanded on:click={toggle}>- {item.name}</span>
{:else}
  <div class="flex">
    <span class="toggle" class:expanded on:click={toggle}>{expanded ? "▼" : "▶"}</span>
    <span>{item.name}</span>
  </div>
{/if}

{#if expanded}
  <ul>
    {#each items as item}
      <li>
        {#if item.items && item.items.length > 0}
          <svelte:self bind:item bind:items={item.items} />
        {:else}
          <span>{item.name ? `- ${item.name}` : ""}</span>
        {/if}
      </li>
    {/each}
  </ul>
{/if}

<style lang="postcss">
  ul {
    @apply ml-5;
  }
  .toggle {
    @apply cursor-pointer leading-none  p-1 py-1;
  }
</style>
