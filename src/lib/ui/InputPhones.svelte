<script lang="ts">
  import { phoneObj } from "$lib/basics/objects";

  const initialValue = Object.assign({}, phoneObj);

  export let placeholder = "Phone Nr.";
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
      <input type="phone" name="phone-{i}" {placeholder} bind:value={item.phone} />

      <div class="grid text-sm mb-3 px-2 place-items-center cursor-pointer">
        <label class="cursor-pointer" for="pp-{i}"> P</label>
        <input class="h-auto cursor-pointer" type="radio" id="pp-{i}" bind:group={primary} name="primary_phone" value={i} />
      </div>

      <div class="grid text-sm mb-3 px-2 place-items-center cursor-pointer">
        <label class="cursor-pointer" for="wa-{i}"> WA</label>
        <input class="h-auto cursor-pointer" type="checkbox" id="wa-{i}" bind:checked={item.whatsapp} />
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
