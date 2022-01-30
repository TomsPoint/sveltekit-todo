<script lang="ts" context="module">
  import * as api from "$lib/api/time_slots";

  export async function load() {
    return { props: { time_slots: await api.time_slot.get() } };
  }
</script>

<script lang="ts">
  import type { Program } from "$lib/interface";

  import { getContext } from "svelte";
  import { WEEKDAYS } from "$lib/constants";
  import ProgramFilter from "$lib/components/filter/ProgramFilter.svelte";
  import WeekdayFilter from "$lib/components/filter/WeekdayFilter.svelte";
  import TimeslotFilter from "$lib/components/filter/TimeslotFilter.svelte";
  import AddTimeSlot from "$lib/components/time_slot/AddTimeSlot.svelte";
  import TimeSlot from "$lib/components/time_slot/TimeSlot.svelte";
  import ReloadButton from "$lib/ui/ReloadButton.svelte";

  export let time_slots = [];
  const getTimeSlot = async () => (time_slots = await api.time_slot.get());

  let TIMESLOTS = time_slots;
  const PROGRAMS: Program[] = getContext("programs");

  let filteredPrograms = PROGRAMS;
  let filteredWeekdays = WEEKDAYS;
  let filteredTimeslots = TIMESLOTS;

  $: filtered_time_slots = time_slots.filter(
    (el) =>
      filteredPrograms.some((item) => el.programs.includes(item.label) || el.programs.length === 0) &&
      filteredWeekdays.includes(el.weekday) &&
      filteredTimeslots.some((item) => item.time.includes(el.time))
  );

  const add = async (e) => {
    console.log("🚀  ~ file: index.svelte ~ line 39 ~ e", e.detail);
    await api.time_slot.post({ ...e.detail, sort_order: 0 });
    getTimeSlot();
  };

  const remove = async (e) => {
    await api.time_slot.delete(e.detail.id);
    getTimeSlot();
  };

  const update = async (e) => {
    await api.time_slot.update(e.detail);
    getTimeSlot();
  };
</script>

<svelte:head>
  <title>Timeslots</title>
</svelte:head>

<section>
  <ReloadButton />
  <!-- <h2>Add Time Slot</h2>
   <AddTimeSlot on:add={add} />
  <hr /> -->
  <h2>Filter Time Slots</h2>
  <div class="grid  gap-2">
    <ProgramFilter bind:filteredPrograms />
    <WeekdayFilter bind:filteredWeekdays />
    <TimeslotFilter bind:filteredTimeslots {TIMESLOTS} />
  </div>

  <hr />
  <h2>Time Slots:</h2>
  <ul>
    {#each filtered_time_slots as time_slot (time_slot.id)}
      <TimeSlot bind:time_slot on:update={update} on:remove={remove} />
    {/each}
  </ul>
  <hr />
</section>

<style lang="postcss">
  hr {
    @apply my-4;
  }
</style>
