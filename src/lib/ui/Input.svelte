<script lang="ts">
  import { uid, toSlug } from "$lib/basics/utils";

  export let id = uid();
  export let placeholder = "";
  export let value;
  export let label = "";
  export let type = "text";
  export let valueFieldName = "";
  export let multiple = false;
  export let pattern = null;
  export let hideRangeValue = false;

  const add = () => (value = [...value, pattern]);

  const remove = (i) => (value = value.filter((_, idx) => idx !== i));

  const name = toSlug(label);

  const handleInput = (e) => (value = type.match(/^(number|range)$/) ? +e.target.value : e.target.value);
</script>

<div class="grid gap-0 mb-2 content-start ">
  {#if label.length > 0}
    <label class="text-sm" for={id}>
      {label}
      {#if type === "range" && value !== undefined && !hideRangeValue}
        ({value})
      {/if}
    </label>
  {/if}
  {#if multiple}
    {#each value as item, i}
      <div class="grid grid-cols-[repeat(1,1fr)repeat(2,auto)] gap-2 items-center">
        {#if valueFieldName === ""}
          <svelte:self bind:value={item} {placeholder} {type} label="" />
        {:else}
          <svelte:self bind:value={item[valueFieldName]} {placeholder} {type} label="" />
        {/if}
        {#if i === value.length - 1}
          <div class="mb-2 rotate-45 cursor-pointer" on:click={add}>✕</div>
        {:else}
          <div class="mb-2 cursor-pointer" on:click={() => remove(i)}>✕</div>
        {/if}
      </div>
    {/each}
  {:else}
    <input {type} {id} {name} {placeholder} {value} on:input={handleInput} on:change on:input {...$$restProps} />
  {/if}
</div>

<style lang="postcss">
  input[type="range"] {
    width: 100%;
    margin: -2px 0;
    background-color: transparent;
    -webkit-appearance: none;
    @apply ring-0 border-none;
  }
  input[type="range"]:focus {
    outline: none;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    background: rgba(0, 0, 0, 0.05);
    border: 0px solid rgba(0, 0, 0, 0);
    border: 0;
    width: 100%;
    height: 20px;
    padding-left: 2px;
    padding-right: 2px;
    cursor: pointer;
  }
  input[type="range"]::-webkit-slider-thumb {
    margin-top: 2px;
    width: 16px;
    height: 16px;
    background: #fcd34d;
    border: 0px solid rgba(0, 0, 0, 0);
    border: 0;
    cursor: pointer;
    -webkit-appearance: none;
  }
  input[type="range"]:focus::-webkit-slider-runnable-track {
    background: #808080;
  }
  input[type="range"]::-moz-range-track {
    background: rgba(0, 0, 0, 0.05);
    border: 0px solid rgba(0, 0, 0, 0);
    border: 0;
    width: 100%;
    height: 20px;
    cursor: pointer;
  }
  input[type="range"]::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #fcd34d;
    border: 0px solid rgba(0, 0, 0, 0);
    border: 0;
    cursor: pointer;
  }
  input[type="range"]::-ms-track {
    background: transparent;
    border-color: transparent;
    border-width: 0 0;
    color: transparent;
    width: 100%;
    height: 20px;
    cursor: pointer;
  }
  input[type="range"]::-ms-fill-lower {
    background: #000000;
    border: 0px solid rgba(0, 0, 0, 0);
    border: 0;
  }
  input[type="range"]::-ms-fill-upper {
    background: rgba(0, 0, 0, 0.05);
    border: 0px solid rgba(0, 0, 0, 0);
    border: 0;
  }
  input[type="range"]::-ms-thumb {
    width: 16px;
    height: 16px;
    background: #fcd34d;
    border: 0px solid rgba(0, 0, 0, 0);
    border: 0;
    cursor: pointer;
    margin-top: 0px;
  }
  input[type="range"]:focus::-ms-fill-lower {
    background: rgba(0, 0, 0, 0.05);
  }
  input[type="range"]:focus::-ms-fill-upper {
    background: #808080;
  }
  @supports (-ms-ime-align: auto) {
    input[type="range"] {
      margin: 0;
    }
  }
</style>
