<script context="module" lang="ts">
  import * as api from "$lib/api/time_slots";

  export async function load() {
    return { props: { time_slot: await api.time_slot.getForCalendar() } };
  }
</script>

<script lang="ts">
  import { getContext } from "svelte";
  import { WEEKDAYS, DATEFORMAT } from "$lib/basics/constants";
  import dayjs from "dayjs";
  import DateSwitcher from "$lib/components/date/DateSwitcher.svelte";
  import Program from "$lib/components/calendar/Program.svelte";
  import ProgramFilter from "$lib/components/filter/ProgramFilter.svelte";
  import WeekdayFilter from "$lib/components/filter/WeekdayFilter.svelte";
  import ReloadButton from "$lib/components/basics/ReloadButton.svelte";

  let filteredWeekdays = WEEKDAYS; // ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  let filteredPrograms = getContext("programs");

  export let time_slot = [];
  let time_slots = time_slot;

  let start;
</script>

<svelte:head>
  <title>Calendar</title>
</svelte:head>

<section>
  <ReloadButton />
  <h1>Calendar</h1>
  <DateSwitcher bind:start />

  <div class="grid gap-2">
    <ProgramFilter bind:filteredPrograms />
    <WeekdayFilter bind:filteredWeekdays />
    <hr />
    <div class="grid gap-4 h-[80vh] overflow-y-scroll">
      {#each WEEKDAYS as weekday, i (weekday)}
        {@const date = dayjs(start).isoWeekday(i + 1)}
        {#if filteredWeekdays.includes(weekday)}
          <ul class="border p-2">
            <li class=" font-bold uppercase">
              {weekday} - {date.format(DATEFORMAT)}
            </li>
            {#each time_slots.filter((slot) => slot.weekday === weekday) as time_slot (time_slot.id)}
              <li class="border p-1 flex gap-4 min-h-[2rem] mb-1">
                <span class="w-[10ch]">{time_slot.time}</span>
                <Program bind:programs={filteredPrograms} date={date.format()} {time_slot} />
                <span />
              </li>
            {/each}
          </ul>
        {/if}
      {/each}
    </div>
  </div>
</section>

<!-- don't delete is needed so the colors don't get purged -->
<div class="hidden bg-ec-100 hover:bg-ec-100 " />
<div class="hidden bg-cf-100 hover:bg-cf-100 " />
<div class="hidden bg-rc-100 hover:bg-rc-100 " />
<div class="hidden bg-py-100 hover:bg-py-100" />
<div class="hidden bg-rd-100 hover:bg-rd-100" />

<div class="hidden bg-ec-200 hover:bg-ec-200 " />
<div class="hidden bg-cf-200 hover:bg-cf-200 " />
<div class="hidden bg-rc-200 hover:bg-rc-200 " />
<div class="hidden bg-py-200 hover:bg-py-200" />
<div class="hidden bg-rd-200 hover:bg-rd-200" />

<div class="hidden bg-ec-300 hover:bg-ec-300 " />
<div class="hidden bg-cf-300 hover:bg-cf-300 " />
<div class="hidden bg-rc-300 hover:bg-rc-300 " />
<div class="hidden bg-py-300 hover:bg-py-300" />
<div class="hidden bg-rd-300 hover:bg-rd-300" />

<div class="hidden bg-ec-400 hover:bg-ec-400" />
<div class="hidden bg-cf-400 hover:bg-cf-400" />
<div class="hidden bg-rc-400 hover:bg-rc-400" />
<div class="hidden bg-py-400 hover:bg-py-400" />
<div class="hidden bg-rd-400 hover:bg-rd-400" />

<div class="hidden text-ec-900 " />
<div class="hidden text-cf-900 " />
<div class="hidden text-rc-900 " />
<div class="hidden text-py-900" />
<div class="hidden text-rd-900" />
