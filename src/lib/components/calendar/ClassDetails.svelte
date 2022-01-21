<script>
  import { studentObj } from "$lib/objects";
  import { openModal } from "svelte-modals";
  import AddClassEnrolmentViaCalendar from "../student/AddClassEnrolmentViaCalendar.svelte";
  import EditClassEnrolmentViaCalendar from "../student/EditClassEnrolmentViaCalendar.svelte";

  export let details = {};

  const { classrooms, capacity, program } = details;

  const editStudentInSlot = (classroom, student) => {
    openModal(EditClassEnrolmentViaCalendar, {
      details,
      classroom_id: classroom.id,
      enrolment: classroom.student_classroom_enrolment.find((el) => el.student_id === student.id),
      student,
    });
  };
  const addStudentToSlot = (classroom_id) => {
    openModal(AddClassEnrolmentViaCalendar, { details, classroom_id });
  };
</script>

{#if capacity > 0}
  <ul>
    {#each classrooms as classroom}
      {#each classroom.student as student, i (student.id)}
        <li
          class="p-1 bg-gray-50 bg-opacity-50 leading-none  bg-{program.label}-200"
          class:error={classroom.capacity - classroom.student_classroom_enrolment.length < 0}
        >
          <div class="flex gap-2">
            <span class="flex-grow text-sm">{student.short_name}</span>
            <button class="edit" on:click={() => editStudentInSlot(classroom, student)}>✐</button>
          </div>
        </li>
      {/each}
      {#if classroom.capacity > 0}
        {#each Array(classroom.capacity - classroom.student_classroom_enrolment.length > 0 ? classroom.capacity - classroom.student_classroom_enrolment.length : 0) as _}
          <li class="p-1 bg-gray-50 bg-opacity-50 leading-none">
            <button class="bg-{program.label}-200 hover:bg-{program.label}-300 text-{program.label}-900" on:click={() => addStudentToSlot(classroom.id)}
              >+</button
            >
          </li>
        {/each}
      {/if}
    {/each}
  </ul>
{/if}

<style lang="postcss">
  ul {
    counter-reset: counter;
    & li {
      @apply mb-[2px] ml-5 pl-1;
      counter-increment: counter;
    }
    & li::marker {
      @apply text-xs;
      content: counter(counter) ". ";
    }
  }
  .error {
    @apply text-red-400;
  }
</style>
