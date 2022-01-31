<script lang="ts">
  import { isDateBetween } from "$lib/basics/utils";
  import StudentDetail from "./StudentDetail.svelte";

  export let date;
  export let program;
  export let time_slot;

  $: classrooms = time_slot.classroom;

  $: activeClassrooms = classrooms.filter((classroom) => isDateBetween(date, classroom.start_date, classroom.end_date));

  $: classrooms_this_program = classrooms.filter((classroom) => classroom.program_id === program.id);

  $: classrooms_this_program_this_date = classrooms_this_program.map((obj) => ({
    ...obj,
    student_classroom_enrolment: obj.student_classroom_enrolment.filter((sce) => isDateBetween(date, sce.start_date, sce.end_date)),
  }));

  $: offline_classrooms = classrooms_this_program_this_date.filter((classroom) => classroom.mode === "offline");
  $: online_classrooms = classrooms_this_program_this_date.filter((classroom) => classroom.mode === "online");

  $: offline_capacity = offline_classrooms.reduce((prev, curr) => prev + curr.capacity, 0);
  $: online_capacity = online_classrooms.reduce((prev, curr) => prev + curr.capacity, 0);

  $: offline_enrolment = offline_classrooms.reduce((prev, curr) => prev + curr.student_classroom_enrolment.length, 0);
  $: online_enrolment = online_classrooms.reduce((prev, curr) => prev + curr.student_classroom_enrolment.length, 0);

  let details = false;
</script>

{#if activeClassrooms.length > 0 || offline_enrolment > 0 || online_enrolment > 0}
  <div class="grid grid-cols-2 gap-2 p-1 bg-{program.label}-100  bg-opacity-50 content-start min-w-[25ch]">
    <div class="col-span-full relative">
      {program.name}
      <div class="absolute right-0 top-0 cursor-pointer" on:click={() => (details = !details)}>{details ? "✕" : "☰"}</div>
    </div>

    <div>
      <li>💻 {offline_enrolment} / {offline_capacity}</li>
      {#if details}
        <ul>
          {#each offline_classrooms as classroom (classroom.id)}
            <StudentDetail {classroom} {program} {time_slot} {classrooms} {date} />
          {/each}
        </ul>
      {/if}
    </div>

    <div>
      <li>🌐 {online_enrolment} / {online_capacity}</li>
      {#if details}
        <ul>
          {#each online_classrooms as classroom, i (classroom.id)}
            <StudentDetail {classroom} {program} {time_slot} {classrooms} {date} />
          {/each}
        </ul>
      {/if}
    </div>
  </div>
{/if}

<style lang="postcss">
  ul {
    list-style: none;
    counter-reset: counter;
  }
</style>
