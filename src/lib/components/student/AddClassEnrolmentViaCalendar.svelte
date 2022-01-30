<script lang="ts">
  import { closeModal } from "svelte-modals";
  import { onMount } from "svelte";
  import { isDateBetween } from "$lib/utils";
  import InputDate from "$lib/ui/InputDate.svelte";
  import Select from "$lib/ui/Select.svelte";

  import * as api from "$lib/api/student_classroom_enrolment";
  import type { StudentClassroomEnrolment } from "$lib/interface";

  export let date;

  let data = [];
  onMount(async () => (data = await api.students.get()));

  // provided by Modals
  export let isOpen;
  export let program;
  export let time_slot;
  export let classroom;

  let classroom_id = classroom.id;

  $: students = data
    .map((person) => ({
      ...person,
      full_name: person.first_name + " " + person.last_name,
      student: {
        ...person.student,
        student_weekly_enrolment: person.student.student_weekly_enrolment.filter((el) => isDateBetween(date, el.start_date, el.end_date)),
      },
    }))
    .filter((person) => person.student.student_weekly_enrolment.some((enrolment) => enrolment.program_id === program.id));

  let enrolment: StudentClassroomEnrolment = { classroom_id, student_id: undefined, start_date: undefined, end_date: undefined };
  let student;

  const _save = async () => {
    await api.enrolment.post({ ...enrolment, classroom_id });
    closeModal();
  };

  const _cancel = () => closeModal();
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <h2 class="mb-4">Add Student</h2>
      <Select
        items={students}
        bind:selectedItem={student}
        bind:value={enrolment.student_id}
        labelFieldName="full_name"
        label="Student Name"
        valueFieldName="student_id"
        placeholder="Pick a Student"
      />
      <span>Timeslot</span>
      <p>
        {time_slot.weekday}
        {time_slot.time}
      </p>
      <span>Program</span>
      <p>
        {program.name}
      </p>
      <span>Mode</span>
      <p>
        {classroom.mode}
      </p>

      <InputDate bind:date={enrolment.start_date} label="Start" />
      <InputDate bind:date={enrolment.end_date} label="End" />

      <div class="actions">
        <button on:click={_cancel}>Cancel</button>
        <button on:click={_save}>Save</button>
      </div>
    </div>
  </div>
{/if}

<style lang="postcss">
  span {
    @apply text-sm;
  }
  p {
    @apply mb-2 border rounded px-1 py-2 cursor-not-allowed text-gray-400;
  }
</style>
