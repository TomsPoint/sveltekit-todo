<script lang="ts">
  import { addressObj } from "$lib/objects";

  const initialValue = Object.assign({}, addressObj);

  export let label = "";
  export let value = [initialValue];
  export let showBilling = false;
  let primary;
  let billing;

  const setPrimaryIndex = () => {
    primary = value.findIndex((item) => item.primary === true) || -1;
    if (primary === -1) primary = 0;
  };

  const setBillingIndex = () => (billing = value.findIndex((item) => item.billing === true));

  const add = () => (value = [...value, initialValue]);

  const remove = async (i) => {
    value = value.filter((_, idx) => idx !== i);
    setPrimaryIndex();
    setBillingIndex();
  };

  if (value.length === 0) add();

  setPrimaryIndex();
  $: value = value.map((el, idx) => ({ ...el, primary: idx === primary ? true : false }));

  setBillingIndex();
  $: value = value.map((el, idx) => ({ ...el, billing: idx === billing ? true : false }));
</script>

<div class="grid gap-0 mb-2 content-start col-span-2 ">
  <label class="text-sm" for="">{label}</label>

  {#each value as item, i}
    <div class="grid grid-cols-[repeat(1,1fr)repeat(4,auto)] gap-2 items-center">
      <div class="grid grid-cols-2 gap-4 mb-8">
        <input type="text" name="street-{i}" placeholder="Street" bind:value={item.street} />
        <input type="text" name="zip-{i}" placeholder="Zip" bind:value={item.zip} />
        <input type="text" name="city-{i}" placeholder="City" bind:value={item.city} />
        <input type="text" name="country-{i}" placeholder="Country" bind:value={item.country} />
      </div>
      <div class="grid text-sm mb-12 px-2 place-items-center">
        <label for="ap-{i}">P</label>
        <input class="h-auto" type="radio" id="ap-{i}" bind:group={primary} name="primary_address" value={i} />
      </div>
      {#if showBilling}
        <div class="grid text-sm mb-12 px-2 place-items-center">
          <label for="ab-{i}">B</label>
          <input class="h-auto" type="radio" id="ab-{i}" bind:group={billing} name="billing" value={i} />
        </div>
      {/if}
      <div class="grid text-sm mb-11 px-2 place-items-center cursor-pointer">
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
