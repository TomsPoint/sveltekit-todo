<script>
  // @ts-nocheck
  import { closeModal } from "svelte-modals";
  import { onMount } from "svelte";
  import InputDate from "../../ui/InputDate.svelte";
  import Select from "../../ui/Select.svelte";

  import * as api from "$lib/api/student_classroom_enrolment";

  let students = [];
  onMount(async () => (students = await api.students.get()));
  $: students = students.map((student) => ({ ...student, full_name: student.first_name + " " + student.last_name }));

  // provided by Modals
  export let isOpen;
  export let program;
  export let time_slot;
  export let classroom_id;
  export let onClose;

  let data = { classroom_id };
  $: console.log("🚀  ~ file: AddClassEnrolmentViaCalendar.svelte ~ line 22 ~ data", data);
  let student = {};

  const _save = async () => {
    await api.enrolment.post(data);
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
        bind:value={data.student_id}
        labelFieldName="full_name"
        label="Student"
        valueFieldName="student_id"
      />

      <InputDate bind:date={data.start_date} label="Start" />
      <InputDate bind:date={data.end_date} label="End" />

      <div class="actions">
        <button on:click={_cancel}>Cancel</button>
        <button on:click={_save}>Save</button>
      </div>
    </div>
  </div>
{/if}
