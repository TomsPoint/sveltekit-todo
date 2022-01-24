<script>
  import { openModal } from "svelte-modals";
  import AddClassEnrolmentViaCalendar from "../student/AddClassEnrolmentViaCalendar.svelte";
  import EditClassEnrolmentViaCalendar from "../student/EditClassEnrolmentViaCalendar.svelte";
  import dayjs from "dayjs";
  import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
  import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
  dayjs.extend(isSameOrBefore);
  dayjs.extend(isSameOrAfter);

  export let date;
  export let program;
  export let time_slot;
  export let updateData;

  $: classrooms = time_slot.classroom;

  $: activeClassrooms = classrooms.filter((classroom) => dayjs(classroom.start_date).isSameOrBefore(date) && dayjs(classroom.end_date).isSameOrAfter(date));

  $: classrooms_this_program = classrooms.filter((classroom) => classroom.program_id === program.id);

  $: classrooms_this_program_this_date = classrooms_this_program.map((obj) => ({
    ...obj,
    student_classroom_enrolment: obj.student_classroom_enrolment.filter(
      (sce) => dayjs(sce.start_date).isSameOrBefore(date) && dayjs(sce.end_date).isSameOrAfter(date)
    ),
  }));

  $: offline_classrooms = classrooms_this_program_this_date.filter((classroom) => classroom.mode === "offline");
  $: online_classrooms = classrooms_this_program_this_date.filter((classroom) => classroom.mode === "online");

  $: offline_capacity = offline_classrooms.reduce((prev, curr) => prev + curr.capacity, 0);
  $: online_capacity = online_classrooms.reduce((prev, curr) => prev + curr.capacity, 0);

  $: offline_enrolment = offline_classrooms.reduce((prev, curr) => prev + curr.student_classroom_enrolment.length, 0);
  $: online_enrolment = online_classrooms.reduce((prev, curr) => prev + curr.student_classroom_enrolment.length, 0);

  let details = false;

  const addStudentToSlot = (classroom_id) => {
    openModal(AddClassEnrolmentViaCalendar, { program, classroom_id, time_slot, onClose: () => updateData() });
  };

  const editStudentToSlot = (classroom_id, enrolment) => {
    openModal(EditClassEnrolmentViaCalendar, { program, classroom_id, time_slot, enrolment, onClose: () => updateData() });
  };
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
            <p class="underline">{classroom.teacher.person[0].first_name}</p>
            {#each classroom.student_classroom_enrolment as enrolment (enrolment.id)}
              <li>
                <span>{enrolment.student.short_name}</span>
                <button
                  class="rotate-180 bg-{program.label}-200 hover:bg-{program.label}-300 text-{program.label}-900"
                  on:click={() => editStudentToSlot(classroom.id, enrolment)}
                >
                  ✐
                </button>
              </li>
            {/each}
            {#each Array(classroom.capacity - classroom.student_classroom_enrolment.length > 0 ? classroom.capacity - classroom.student_classroom_enrolment.length : 0) as item}
              <li>
                <span />
                <button class="bg-{program.label}-200 hover:bg-{program.label}-300 text-{program.label}-900" on:click={() => addStudentToSlot(classroom.id)}>
                  +
                </button>
              </li>
            {/each}
          {/each}
        </ul>
      {/if}
    </div>

    <div>
      <li>🌐 {online_enrolment} / {online_capacity}</li>
      {#if details}
        <ul>
          {#each online_classrooms as classroom, i (classroom.id)}
            <p class="underline">{classroom.teacher.person[0].first_name}</p>
            {#each classroom.student_classroom_enrolment as enrolment (enrolment.id)}
              <li>
                <span>{enrolment.student.short_name}</span>
                <button
                  class="rotate-180 bg-{program.label}-200 hover:bg-{program.label}-300 text-{program.label}-900"
                  on:click={() => editStudentToSlot(classroom.id)}
                >
                  ✐
                </button>
              </li>
            {/each}
            {#each Array(classroom.capacity - classroom.student_classroom_enrolment.length > 0 ? classroom.capacity - classroom.student_classroom_enrolment.length : 0) as item}
              <li>
                <span />
                <button class="bg-{program.label}-200 hover:bg-{program.label}-300 text-{program.label}-900" on:click={() => addStudentToSlot(classroom.id)}>
                  +
                </button>
              </li>
            {/each}
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
  }
</style>
