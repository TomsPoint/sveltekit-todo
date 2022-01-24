<script>
  // @ts-nocheck
  import { closeModal } from "svelte-modals";
  import { onMount } from "svelte";
  import { isDateBetween } from "$lib/utils";
  import InputDate from "$lib/ui/InputDate.svelte";
  import Select from "$lib/ui/Select.svelte";

  import * as api from "$lib/api/student_classroom_enrolment";

  export let date;

  let data = [];
  onMount(async () => (data = await api.students.get()));

  // provided by Modals
  export let isOpen;
  export let program;
  export let time_slot;
  export let classroom_id;
  export let onClose;

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

  let enrolment = { classroom_id };
  let student = {};

  const _save = async () => {
    await api.enrolment.post(enrolment);
    closeModal();
    onClose();
  };

  const _cancel = () => closeModal();
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <h2>Add Student</h2>
      <p class="mb-8">{time_slot.weekday} {time_slot.time} - {program.name}</p>
      <Select
        items={students}
        bind:selectedItem={student}
        bind:value={enrolment.student_id}
        labelFieldName="full_name"
        label="Student"
        valueFieldName="student_id"
      />

      <InputDate bind:date={enrolment.start_date} label="Start" />
      <InputDate bind:date={enrolment.end_date} label="End" />

      <div class="actions">
        <button on:click={_cancel}>Cancel</button>
        <button on:click={_save}>Save</button>
      </div>
    </div>
  </div>
{/if}
