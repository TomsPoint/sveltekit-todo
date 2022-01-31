<script lang="ts">
  import type { Program, Student } from "$lib/basics/interface";

  import { getContext } from "svelte";
  import { openModal } from "svelte-modals";
  import { DATEFORMAT } from "$lib/basics/constants";
  import * as api from "$lib/api/student_weekly_enrolment";
  import dayjs from "dayjs";
  import EditEnrolment from "./EditWeeklyEnrolment.svelte";
  import AddEnrolment from "./AddWeeklyEnrolment.svelte";

  export let student: Student;
  let { student_weekly_enrolment: enrolment } = student;

  const programs: Program[] = getContext("programs");

  const addEnrolment = async () => openModal(AddEnrolment, { student_id: student.id });

  const editEnrolment = async (item) => openModal(EditEnrolment, { item });

  const deleteEnrolment = async (id) => {
    await api.enrolment.delete(id);
    enrolment = enrolment.filter((el) => el.id !== id);
  };
</script>

<h3>Programs:</h3>
<ul class="data-table">
  <li class="table-header">
    <span class=" !text-left">Program</span>
    <span>Frequency</span>
    <span>Start</span>
    <span>End</span>
  </li>
  {#each enrolment.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()) as item}
    <li>
      <span class=" !text-left">{programs.find((el) => el.id === item.program_id).name}</span>
      <span class="">{item.frequency}</span>
      <span>{dayjs(item.start_date).format(DATEFORMAT)}</span>
      <span>{dayjs(item.end_date).format(DATEFORMAT)}</span>
      <span class="btn-group">
        <button class="delete" on:click={() => deleteEnrolment(item.id)}>✕</button>
        <button class="edit" on:click={() => editEnrolment(item)}>✐</button>
      </span>
    </li>
  {/each}
  <button class="add" on:click={addEnrolment}>Add Enrolment</button>
</ul>

<style lang="postcss">
  li {
    @apply grid-cols-[repeat(1,20ch)repeat(3,10ch)repeat(1,auto)];
  }
</style>
