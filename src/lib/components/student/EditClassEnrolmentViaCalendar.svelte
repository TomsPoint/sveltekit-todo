<script lang="ts">
  import { closeModal } from "svelte-modals";
  import * as api from "$lib/api/student_classroom_enrolment";
  import InputDate from "$lib/ui/InputDate.svelte";
  import Select from "$lib/ui/Select.svelte";

  export let isOpen;
  export let program;
  export let time_slot;
  export let classroom_id = "";
  export let classrooms;
  export let enrolment;
  export let onClose;

  classrooms.forEach((el) => {
    el.label = `${el.teacher.person[0].first_name} - ${el.mode} - (${el.student_classroom_enrolment.length}/${el.capacity})`;
  });

  let selectedClassroom = classrooms.find((el) => el.id == classroom_id);

  let data = {
    id: enrolment.id,
    classroom_id: classroom_id,
    student_id: enrolment.student_id,
    start_date: enrolment.start_date,
    end_date: enrolment.end_date,
  };

  $: filteredClassrooms = classrooms.filter(
    (el) =>
      program?.id === el.program_id && el.id !== classroom_id && el.time_slot_id === time_slot.id && el.capacity - el.student_classroom_enrolment.length > 0
  );

  const _save = async () => {
    await api.enrolment.update(data);
    closeModal();
    onClose();
  };

  const _cancel = () => closeModal();
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <h3 class="mb-8">Edit Student:</h3>
      <h2 class="mb-2">{enrolment.student.person[0].first_name} {enrolment.student.person[0].last_name}</h2>
      <p class="mb-4 grid grid-cols-2"><span>{time_slot.weekday} {time_slot.time}</span> <span>{program.name}</span></p>
      <hr class="col-span-full my-8" />
      <Select
        items={filteredClassrooms}
        bind:selectedItem={selectedClassroom}
        bind:value={data.classroom_id}
        label="Assigned Teacher:"
        labelFieldName="label"
        valueFieldName="id"
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
