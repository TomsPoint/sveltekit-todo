<script lang="ts">
  import { emailObj } from "$lib/basics/objects";

  const initialValue = Object.assign({}, emailObj);

  export let placeholder = "Email";
  export let label = "";
  export let value = [initialValue];
  let primary;

  const setPrimaryIndex = () => {
    primary = value.findIndex((item) => item.primary === true);
    if (primary === -1) primary = 0;
  };

  const add = () => (value = [...value, initialValue]);

  const remove = (i) => {
    value = value.filter((_, idx) => idx !== i);
    setPrimaryIndex();
  };

  if (value.length === 0) add();

  setPrimaryIndex();
  $: value = value.map((el, idx) => ({ ...el, primary: idx === primary ? true : false }));
</script>

<div class="grid gap-0 mb-2 content-start">
  <label class="text-sm" for="">{label}</label>

  {#each value as item, i}
    <div class="grid grid-cols-[repeat(1,1fr)repeat(3,auto)] gap-2 items-center">
      <input type="email" name="email-{i}" {placeholder} bind:value={item.email} />
      <div class="grid text-sm mb-3 px-2 place-items-center">
        <label for="ep-{i}"> P</label>
        <input class="h-auto" type="radio" id="ep-{i}" bind:group={primary} name="primary_email" value={i} />
      </div>
      <div class="grid text-sm mb-2 px-2 place-items-center cursor-pointer">
        {#if i === value.length - 1}
          {#if value.length > 1}
            <div class="cursor-pointer" on:click={() => remove(i)}>✕</div>
          {/if}
          <div class="rotate-45 cursor-pointer" on:click={add}>✕</div>
        {:else}
          <div class="cursor-pointer" on:click={() => remove(i)}>✕</div>
        {/if}
      </div>
    </div>
  {/each}
</div>
