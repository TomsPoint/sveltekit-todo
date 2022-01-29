<script lang="ts">
  import { uid, toSlug } from "$lib/utils";

  export let id = uid();
  export let items = [];
  export let value = undefined;
  export let label = "";

  export let labelFieldName = "";
  export let valueFieldName = "";
</script>

<div class="grid gap-0 mb-2">
  <label class="text-sm" for={id}>{label}</label>
  <div class="flex place-items-center gap-2 cursor-pointer">
    {#each items as item, i}
      {#if typeof item === "object"}
        <input type="radio" id={`${toSlug(item.name)}-${i}`} value={item[valueFieldName]} bind:group={value} on:change />
        <label class="mr-2" for={`${toSlug(item.name)}-${i}`}> {item[labelFieldName]} </label>
      {:else}
        <input type="radio" id={`${toSlug(item)}-${i}`} value={item} bind:group={value} on:change />
        <label class="mr-2" for={`${toSlug(item)}-${i}`}> {item} </label>
      {/if}
    {/each}
  </div>
</div>
