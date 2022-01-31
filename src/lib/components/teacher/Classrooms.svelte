<script lang="ts">
  import type { Program } from "$lib/basics/interface";

  import { getContext } from "svelte";
  import { DATEFORMAT, WEEKDAYS } from "$lib/basics/constants";
  import { openModal } from "svelte-modals";
  import * as api from "$lib/api/classrooms";
  import dayjs from "dayjs";
  import AddClass from "$lib/components/teacher/AddClass.svelte";
  import EditClass from "$lib/components/teacher/EditClass.svelte";
  import ProgramFilter from "$lib/components/filter/ProgramFilter.svelte";
  import WeekdayFilter from "$lib/components/filter/WeekdayFilter.svelte";

  export let data;
  const { classroom, programs } = data.teacher;

  const PROGRAM: Program[] = getContext("programs");
  let selectedPrograms = PROGRAM.filter((el) => programs.includes(el.label));

  let filteredPrograms = PROGRAM;
  let filteredWeekdays = WEEKDAYS;

  function openAddClass() {
    openModal(AddClass, { programs: selectedPrograms, teacher: data.teacher });
  }
  function openEditClass(item) {
    openModal(EditClass, { programs: selectedPrograms, item });
  }
  async function deleteClassroom(id) {
    await api.classrooms.delete(id);
    location.reload();
  }
</script>

<div class="grid col-span-full">
  <WeekdayFilter bind:filteredWeekdays />
  <ProgramFilter bind:filteredPrograms />
</div>

<ul class="data-table">
  <li class="table-header">
    <span class=" !text-left">Weekday</span>
    <span>Time</span>
    <span>Program</span>
    <span>Mode</span>
    <span>Capacity</span>
    <span>Start</span>
    <span>End</span>
    <span>&nbsp;</span>
  </li>
  {#each classroom.sort((a, b) => a.time_slot_id - b.time_slot_id) as item}
    {#if filteredWeekdays.includes(item.time_slot.weekday) && filteredPrograms.map((el) => el.id).includes(item.program_id)}
      <li>
        <span class="!text-left">{item.time_slot.weekday}</span>
        <span>{item.time_slot.time}</span>
        <span class="uppercase">{PROGRAM.find((el) => el.id === item.program_id).label}</span>
        <span>{item.mode}</span>
        <span>{item.capacity}</span>
        <span>{dayjs(item.start_date).format(DATEFORMAT)}</span>
        <span>{dayjs(item.end_date).format(DATEFORMAT)}</span>
        <span class="btn-group">
          <button class="delete" on:click={() => deleteClassroom(item.id)}>✕</button>
          <button class="edit" on:click={() => openEditClass(item)}>✐</button>
        </span>
      </li>
    {/if}
  {/each}
</ul>
<button on:click={openAddClass}>Add Class</button>

<style lang="postcss">
  li {
    @apply grid-cols-[repeat(7,10ch)repeat(1,auto)];
  }
</style>
