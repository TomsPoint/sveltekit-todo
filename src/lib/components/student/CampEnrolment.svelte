<script lang="ts">
  import { getContext } from "svelte";
  import { openModal } from "svelte-modals";
  import { DATEFORMAT } from "$lib/constants";
  import * as api from "$lib/api/student_weekly_enrolment";
  import dayjs from "dayjs";
  import EditEnrolment from "./EditCampEnrolment.svelte";
  import AddEnrolment from "./AddCampEnrolment.svelte";
  import type { Student, Program } from "$lib/interface";

  export let student: Student;
  let { student_camp_enrolment: enrolment } = student;

  const programs: Program[] = getContext("programs");

  const addEnrolment = async () => openModal(AddEnrolment, { student });

  const editEnrolment = async (item) => openModal(EditEnrolment, { item });

  const deleteEnrolment = async (id) => {
    await api.enrolment.delete(id);
    enrolment = enrolment.filter((el) => el.id !== id);
  };
</script>

<h3>Camp:</h3>
<ul class="data-table">
  <li class="table-header">
    <span class="left">Program</span>
    <span>Mode</span>
    <span>Start</span>
    <span>End</span>
  </li>
  {#each enrolment.sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()) as item}
    <li>
      <span class=" !text-left">{item.camp.time_slot.weekday}</span>
      <span class="left">{programs.find((el) => el.id === item.camp.program_id).name}</span>
      <span>{item.camp.mode}</span>
      <span>{dayjs(item.camp.start_date).format(DATEFORMAT)}</span>
      <span>{dayjs(item.camp.end_date).format(DATEFORMAT)}</span>
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
