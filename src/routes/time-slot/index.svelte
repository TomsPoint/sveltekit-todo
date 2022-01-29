<script lang="ts" context="module">
  import * as api from "$lib/api/time_slots";

  export async function load() {
    return { props: { time_slots: await api.time_slot.get() } };
  }
</script>

<script>
  // @ts-nocheck
  import { getContext } from "svelte";
  import { WEEKDAY, WEEKDAYS, WEEKEND } from "$lib/constants";
  import AddTimeSlot from "$lib/components/time_slot/AddTimeSlot.svelte";
  import TimeSlot from "$lib/components/time_slot/TimeSlot.svelte";

  export let time_slots = [];
  const getTimeSlot = async () => (time_slots = await api.time_slot.get());

  const PROGRAMS = getContext("programs").map((obj) => obj.label);
  let TIMESLOTS = [...new Set(time_slots.map((obj) => obj.time))];

  let programs_group = PROGRAMS;
  let timeslots_group = TIMESLOTS;
  let weekdays_group = WEEKDAYS;

  $: filtered_time_slots = time_slots.filter(
    (el) => weekdays_group.includes(el.weekday) && programs_group.some((item) => el.programs.includes(item)) && timeslots_group.includes(el.time)
  );

  const updateFilter = () => {
    TIMESLOTS = [...new Set(filtered_time_slots.map((obj) => obj.time))];
    // timeslots_group = [...new Set(filtered_time_slots.filter((el) => el).map((obj) => obj.time))];
  };

  const add = async (e) => {
    await api.time_slot.post(e.detail);
    getTimeSlot();
  };
  const remove = async (e) => {
    await api.time_slot.delete(e.detail.id);
    getTimeSlot();
  };

  const update = async (e) => {
    await api.time_slot.update(e.detail);
  };
</script>

<section>
  <h2>Add Time Slot</h2>
  <AddTimeSlot on:add={add} />
  <hr />
  <h2>Filter Time Slots</h2>
  <div class="grid  gap-2">
    <div class="flex gap-2 p-1 place-items-center">
      <button class="text-xs" on:click={() => (programs_group = PROGRAMS)}>ALL</button>
      <button class="text-xs" on:click={() => (programs_group = [])}>NONE</button>
      {#each PROGRAMS as item}
        <label class="flex gap-2 place-items-center uppercase"
          ><input type="checkbox" bind:group={programs_group} name="programs" value={item} on:change={updateFilter} /> {item}</label
        >
      {/each}
    </div>
    <div class="flex gap-2 p-1 place-items-center">
      <button class="text-xs" on:click={() => (weekdays_group = WEEKDAYS)}>ALL</button>
      <button class="text-xs" on:click={() => (weekdays_group = [])}>NONE</button>
      <button class="text-xs" on:click={() => (weekdays_group = WEEKDAY)}>WEEKDAY</button>
      <button class="text-xs" on:click={() => (weekdays_group = WEEKEND)}>WEEKEND</button>
      {#each WEEKDAYS as day}
        <label class="flex gap-2 place-items-center uppercase">
          <input type="checkbox" bind:group={weekdays_group} name="weekdays" value={day} on:change={updateFilter} />
          {day.slice(0, 3)}
        </label>
      {/each}
    </div>
    <div class="flex gap-2 p-1 place-items-center ">
      <button class="text-xs" on:click={() => (timeslots_group = TIMESLOTS)}>ALL</button>
      <button class="text-xs" on:click={() => (timeslots_group = [])}>NONE</button>

      <div class="flex gap-x-4 flex-wrap">
        {#each TIMESLOTS as timeslot}
          <label class="flex gap-2 place-items-center whitespace-nowrap">
            <input type="checkbox" bind:group={timeslots_group} name="timeslot" value={timeslot} on:change={updateFilter} />
            {timeslot}
          </label>
        {/each}
      </div>
    </div>
  </div>

  <hr />
  <h2>Time Slots:</h2>
  <ul>
    {#each filtered_time_slots as time_slot (time_slot.id)}
      <TimeSlot bind:time_slot on:update={() => update} on:remove={() => remove} />
    {/each}
  </ul>
  <hr />
</section>

<style lang="postcss">
  hr {
    @apply my-4;
  }
</style>
