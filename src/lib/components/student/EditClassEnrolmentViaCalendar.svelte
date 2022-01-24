<script>
  // @ts-nocheck
  import { closeModal } from "svelte-modals";
  import { put } from "$lib/api_old";
  import InputDate from "../../ui/InputDate.svelte";

  export let isOpen;
  export let program;
  export let time_slot;
  export let classroom_id = "";
  export let enrolment;
  export let onClose;

  let data = {
    id: enrolment.id,
    classroom_id,
    student_id: enrolment.student_id,
    start_date: enrolment.start_date,
    end_date: enrolment.end_date,
  };

  const _save = async () => {
    await put("student_classroom_enrolment", data);
    closeModal();
    onClose();
  };

  const _cancel = () => closeModal();
</script>

{#if isOpen}
  <div role="dialog" class="modal">
    <div class="contents">
      <h3 class="mb-8">Edit Student:</h3>
      <h2 class="mb-4">{enrolment.student.person[0].first_name} {enrolment.student.person[0].last_name}</h2>
      <p class="mb-4">{program.name}</p>
      <p class="mb-4">{time_slot.weekday} {time_slot.time}</p>

      <InputDate bind:date={data.start_date} label="Start" />
      <InputDate bind:date={data.end_date} label="End" />

      <div class="actions">
        <button on:click={_cancel}>Cancel</button>
        <button on:click={_save}>Save</button>
      </div>
    </div>
  </div>
{/if}
