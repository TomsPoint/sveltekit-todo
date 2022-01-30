<script lang="ts">
  import type { Program } from "$lib/interface";

  import { createEventDispatcher, getContext } from "svelte";
  import { TIMESLOTS, WEEKDAYS } from "$lib/constants";
  import Select from "$lib/ui/Select.svelte";
  import Input from "$lib/ui/Input.svelte";

  const dispatch = createEventDispatcher();

  export let time_slot;

  const PROGRAM: Program[] = getContext("programs");
  let selectedPrograms = PROGRAM.filter((el) => time_slot.programs.includes(el.label));

  async function remove() {
    dispatch("remove", time_slot);
  }

  async function update() {
    dispatch("update", time_slot);
  }
</script>

<li class="flex gap-2 items-center mb-2 px-4">
  <Input bind:value={time_slot.sort_order} placeholder="Order" on:change={update} class="w-16" />
  <Select items={WEEKDAYS} bind:selectedItem={time_slot.weekday} onChange={update} />
  <Select items={TIMESLOTS.map((el) => el.time)} bind:selectedItem={time_slot.time} onChange={update} />
  <Input bind:value={time_slot.duration} placeholder="Duration in Minutes" on:change={update} class="w-16" />
  <Select
    items={PROGRAM}
    bind:value={time_slot.programs}
    bind:selectedItem={selectedPrograms}
    multiple
    labelFieldName="name"
    valueFieldName="label"
    tagFieldName="label"
    onChange={update}
    containerClassName="w-full"
  />
  <!-- <Input bind:value={time_slot.label} placeholder="Label" on:change={update} /> -->

  <!-- <span class="text-xl text-gray-400 cursor-pointer" on:click={remove}>✕</span> -->
</li>
