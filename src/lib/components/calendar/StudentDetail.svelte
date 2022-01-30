<script>
  import { openModal } from "svelte-modals";
  import AbsenceViaCalendar from "../student/AbsenceViaCalendar.svelte";
  import AddClassEnrolmentViaCalendar from "../student/AddClassEnrolmentViaCalendar.svelte";
  import EditClassEnrolmentViaCalendar from "../student/EditClassEnrolmentViaCalendar.svelte";

  export let classroom;
  export let program;
  export let time_slot;
  export let classrooms;
  export let date;

  const addStudentToSlot = (classroom) => {
    openModal(AddClassEnrolmentViaCalendar, { program, classroom, time_slot, date });
  };

  const editStudentToSlot = (classroom_id, enrolment) => {
    openModal(EditClassEnrolmentViaCalendar, { program, classrooms, classroom_id, time_slot, enrolment });
  };
  const editStudentAbsence = (classroom_id, enrolment) => {
    openModal(AbsenceViaCalendar, { program, time_slot, enrolment, date, classroom_id });
  };
</script>

<p class="underline">{classroom.teacher.person[0].first_name}</p>
{#each classroom.student_classroom_enrolment as enrolment (enrolment.id)}
  <li>
    <span>{enrolment.student.short_name} {enrolment.id}</span>
    <button
      class="rotate-90 bg-{program.label}-200 hover:bg-{program.label}-300 text-{program.label}-900"
      on:click={() => editStudentAbsence(classroom.id, enrolment)}
      >⎋
    </button>
    <button
      class="rotate-180 bg-{program.label}-200 hover:bg-{program.label}-300 text-{program.label}-900"
      on:click={() => editStudentToSlot(classroom.id, enrolment)}
      >✐
    </button>
  </li>
{/each}
{#each Array(classroom.capacity - classroom.student_classroom_enrolment.length > 0 ? classroom.capacity - classroom.student_classroom_enrolment.length : 0) as item}
  <li>
    <span />
    <button class="bg-{program.label}-200 hover:bg-{program.label}-300 text-{program.label}-900" on:click={() => addStudentToSlot(classroom)}> + </button>
  </li>
{/each}

<style lang="postcss">
  li {
    @apply text-sm ml-0 bg-yellow-50  items-center rounded mb-1  flex gap-1 leading-none;
    counter-increment: counter;
    span {
      @apply flex-grow;
    }
    button {
      @apply justify-self-end text-xs;
    }
  }
  li::before {
    @apply text-yellow-900 pl-1;
    content: counter(counter) ". ";
  }
</style>
