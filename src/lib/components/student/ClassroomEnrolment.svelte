<script lang="ts">
  import type { Program, Student } from "$lib/interface";

  import { getContext } from "svelte";
  import { openModal } from "svelte-modals";
  import { DATEFORMAT } from "$lib/constants";
  import * as api from "$lib/api/student_classroom_enrolment";
  import dayjs from "dayjs";
  import EditEnrolment from "./EditClassroomEnrolment.svelte";
  import AddEnrolment from "./AddClassroomEnrolment.svelte";

  export let student: Student;
  let { student_classroom_enrolment: enrolment } = student;

  const programs: Program[] = getContext("programs");

  const addEnrolment = async () => openModal(AddEnrolment, { student });

  const editEnrolment = async (item) => openModal(EditEnrolment, { item });

  const deleteEnrolment = async (id) => {
    await api.enrolment.delete(id);
    enrolment = enrolment.filter((el) => el.id !== id);
  };
</script>

<h3>Class:</h3>
<ul class="data-table">
  <li class="table-header">
    <span class=" !text-left">Weekday</span>
    <span>Time</span>
    <span>Program</span>
    <span>Mode</span>
    <span>Teacher</span>
    <span>Start</span>
    <span>End</span>
  </li>
  {#each enrolment.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()) as item (item.id)}
    <li>
      <span class=" !text-left">{item.classroom.time_slot.weekday}</span>
      <span>{item.classroom.time_slot.time}</span>
      <span class="uppercase">{programs.find((el) => el.id === item.classroom.program_id).label}</span>
      <span>{item.classroom.mode}</span>
      <span>{item.classroom.teacher.person[0].first_name}</span>
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
    @apply grid-cols-[repeat(7,10ch)repeat(1,auto)];
  }
</style>
