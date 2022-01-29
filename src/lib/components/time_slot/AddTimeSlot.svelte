<script lang="ts">
  import type { Program } from "$lib/interface";

  import { createEventDispatcher, getContext } from "svelte";
  import { TIMESLOTS, WEEKDAYS } from "$lib/constants";
  import Select from "$lib/ui/Select.svelte";

  const dispatch = createEventDispatcher();

  let newData = {
    weekday: null,
    time: null,
    programs: [],
  };

  let programs: Program[] = getContext("programs");

  const add = async () => {
    dispatch("add", newData);
  };
</script>

<form on:submit|preventDefault={add}>
  <label for="">
    Weekday:
    <Select items={WEEKDAYS} bind:selectedItem={newData.weekday} />
  </label>
  <label for="">
    Timeslot:
    <Select items={TIMESLOTS} bind:selectedItem={newData.time} />
  </label>
  <label for="">
    Program(s):
    <Select items={programs.map((a) => a.label.toUpperCase())} bind:selectedItem={newData.programs} multiple />
  </label>

  <button class="rounded-l-none place-self-end h-10">Add Time Slot</button>
</form>

<style lang="postcss">
  form {
    @apply flex gap-2;
  }
  label {
    @apply grid text-sm;
  }
</style>
