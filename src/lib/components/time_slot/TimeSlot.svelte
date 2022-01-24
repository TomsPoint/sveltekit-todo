<script>
  // @ts-nocheck
  import { createEventDispatcher, getContext } from "svelte";
  import { TIMESLOTS, WEEKDAYS } from "$lib/constants";
  import Select from "$lib/ui/Select.svelte";
  import Input from "../../ui/Input.svelte";

  const dispatch = createEventDispatcher();

  export let time_slot;
  if (time_slot.label === null) time_slot.label = time_slot.weekday.slice(0, 3) + " " + time_slot.time;

  const PROGRAM = getContext("programs");
  let selectedPrograms = PROGRAM.filter((el) => time_slot.programs.includes(el.label));

  const update = async () => {
    dispatch("update", time_slot);
  };
</script>

<li class="flex gap-2 items-center mb-2 px-4">
  <Select items={WEEKDAYS} bind:selectedItem={time_slot.weekday} onChange={update} />
  <Select items={TIMESLOTS} bind:selectedItem={time_slot.time} onChange={update} />
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
  <Input bind:value={time_slot.duration} placeholder="Duration in Minutes" on:change={update} />
  <Input bind:value={time_slot.label} placeholder="Label" on:change={update} />

  <span class="text-xl text-gray-400" on:click={() => dispatch("remove", time_slot)}>✕</span>
</li>
