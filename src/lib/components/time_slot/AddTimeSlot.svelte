<script lang="ts">
  import type { Program } from "$lib/basics/interface";

  import { createEventDispatcher, getContext } from "svelte";
  import { TIMESLOTS, WEEKDAYS } from "$lib/basics/constants";
  import Select from "$lib/ui/Select.svelte";

  const dispatch = createEventDispatcher();

  let newData = {
    weekday: null,
    time: null,
    programs: [],
    label: "",
  };

  let programs: Program[] = getContext("programs");
  let timeslot;
  let weekday;

  async function add() {
    dispatch("add", { ...newData, label: `${weekday.slice(0, 3)} ${timeslot.time}`, duration: timeslot.duration });
  }
</script>

<form on:submit|preventDefault={add}>
  <label for="">
    Weekday:
    <Select items={WEEKDAYS} bind:selectedItem={weekday} bind:value={newData.weekday} />
  </label>
  <label for="">
    Timeslot:
    <Select items={TIMESLOTS} bind:selectedItem={timeslot} bind:value={newData.time} valueFieldName="time" labelFieldName="time" />
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
