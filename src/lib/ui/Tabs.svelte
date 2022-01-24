<script>
  export let items;
  export let active;
  export let labelFieldName = "name";
  export let valueFieldName = "name";
</script>

<div class="p-4">
  <ul class="flex gap-4 w-full">
    {#each items as item}
      <li class:active={item.name === active} on:click={() => (active = item[valueFieldName])}>{item[labelFieldName]}</li>
    {/each}
  </ul>
  <div class="p-4 ">
    <slot><!-- optional fallback --></slot>
  </div>
</div>

<style lang="postcss">
  li {
    @apply cursor-pointer hover:text-yellow-400;
    &.active {
      @apply border-b-2 border-b-yellow-400;
    }
  }
</style>
